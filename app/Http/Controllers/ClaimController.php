<?php

namespace App\Http\Controllers;

use App\Events\ConversationUpdated;
use App\Events\MessageSent;
use App\Models\Claim;
use App\Models\Conversation;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    /**
     * Create a new claim/request for a post.
     */
    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        // Cannot claim your own post
        if ($user->id === $post->user_id) {
            return response()->json([
                'error' => 'You cannot submit a request for your own post.',
            ], 422);
        }

        // Cannot claim a post that is already resolved (reactivate it first).
        if ($post->status === 'resolved') {
            return response()->json([
                'error' => 'This post is already resolved.',
            ], 422);
        }

        // Block only if the user has a request still in flight. Once a previous
        // claim is completed/rejected (e.g. the post was resolved and later
        // reactivated), the user may request again.
        $activeClaim = Claim::where('post_id', $post->id)
            ->where('claimant_id', $user->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($activeClaim) {
            return response()->json([
                'error' => 'You have already submitted a request for this post.',
                'claim' => $this->formatClaim($activeClaim),
            ], 409);
        }

        $validated = $request->validate([
            'message' => 'nullable|string|max:1000',
        ]);

        $claim = Claim::create([
            'post_id' => $post->id,
            'claimant_id' => $user->id,
            'owner_id' => $post->user_id,
            'status' => 'pending',
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request sent successfully!',
            'claim' => $this->formatClaim($claim),
        ], 201);
    }

    /**
     * Check user's claim status for a specific post.
     */
    public function getUserClaim(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        $claim = Claim::where('post_id', $post->id)
            ->where('claimant_id', $user->id)
            ->latest('id')
            ->first();

        if (! $claim) {
            return response()->json([
                'has_claim' => false,
                'claim' => null,
            ]);
        }

        return response()->json([
            'has_claim' => true,
            'claim' => $this->formatClaim($claim),
        ]);
    }

    /**
     * Resolve a claim — mark as completed and post as resolved.
     * Only the post owner may call this.
     */
    public function resolve(Request $request, Claim $claim): JsonResponse
    {
        if ($request->user()->id !== $claim->owner_id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $claim->update(['status' => 'completed']);
        $claim->post->update(['status' => 'resolved']);

        return response()->json([
            'success' => true,
            'claim'   => $this->formatClaim($claim),
        ]);
    }

    /**
     * Reject a claim — mark as rejected.
     * Only the post owner may call this.
     */
    public function reject(Request $request, Claim $claim): JsonResponse
    {
        if ($request->user()->id !== $claim->owner_id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $claim->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'claim'   => $this->formatClaim($claim),
        ]);
    }

    /**
     * Follow up on a claim by chat: open (or reuse) the conversation between
     * owner and claimant and drop in an automatic request card. The template
     * (verification vs received) depends on the caller's role + post type.
     */
    public function followUp(Request $request, Claim $claim): JsonResponse
    {
        $user = $request->user();

        if (! $this->isParticipant($user->id, $claim)) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $claim->loadMissing('post');

        $conversation = Conversation::findOrCreateBetween($claim->owner_id, $claim->claimant_id);

        // The first time the claimant follows up via chat, post their request
        // note (or a default intro) ONCE. Never repeated on later chat presses.
        if ($user->id === $claim->claimant_id && ! $claim->intro_message_sent) {
            $this->postActionMessage($claim, $user->id, $this->introMessageBody($claim));
            $claim->update(['intro_message_sent' => true]);
        }

        // Always drop a FRESH card matching the caller's role so it resurfaces
        // at the bottom of the conversation (won't get buried in a long chat).
        // Each party gets their own card type when they press chat from a post
        // detail. Chatting directly (conversation list) doesn't hit this
        // endpoint, so no card appears there.
        $this->createCard($conversation, $claim, $claim->templateFor($user->id), $user->id);

        // Sender has obviously "read" their own card.
        $conversation->participants()
            ->updateExistingPivot($user->id, ['last_read_at' => now()]);

        return response()->json([
            'success' => true,
            'conversation_id' => $conversation->id,
        ], 201);
    }

    /**
     * Create a fresh handshake card for a claim and broadcast it to the other
     * participant. A new card is posted on every follow-up (by design) so it
     * stays visible at the bottom of a long conversation.
     */
    private function createCard(Conversation $conversation, Claim $claim, string $template, int $authorId): void
    {
        $label = $template === 'verification' ? '📦 Item verification' : '📦 Item handover';

        $message = $conversation->messages()->create([
            'user_id' => $authorId,
            'body' => $label,
            'type' => 'card',
            'meta' => [
                'template' => $template,
                'claim_id' => $claim->id,
                'claim_status' => $claim->status,
                'holder_id' => $claim->holderId(),
                'recipient_id' => $claim->recipientId(),
                'post' => [
                    'id' => $claim->post->id,
                    'title' => $claim->post->title,
                    'image_url' => $claim->post->image_url,
                    'type' => $claim->post->type,
                ],
            ],
        ]);

        $message->load('sender:id,name,username,profile_icon');

        broadcast(new MessageSent($message))->toOthers();

        $conversation->load('participants');
        broadcast(new ConversationUpdated($conversation, [
            'id' => $message->id,
            'body' => $message->body,
            'type' => $message->type,
            'sender_id' => $message->user_id,
            'sender_name' => $message->sender->name,
            'created_at' => $message->created_at->toISOString(),
        ]))->toOthers();
    }

    /**
     * Holder verifies the item is genuine (handshake step 1).
     */
    public function verify(Request $request, Claim $claim): JsonResponse
    {
        $claim->loadMissing('post');

        if ($request->user()->id !== $claim->holderId()) {
            return response()->json(['error' => 'Only the item holder can verify.'], 403);
        }

        if ($claim->status !== 'pending') {
            return response()->json([
                'error' => 'This request can no longer be verified.',
                'claim' => $this->formatClaim($claim),
            ], 422);
        }

        $claim->update(['status' => 'accepted']);

        return response()->json([
            'success' => true,
            'claim' => $this->formatClaim($claim),
        ]);
    }

    /**
     * Recipient confirms they received the item (handshake step 2):
     * completes the claim and resolves the post.
     */
    public function receive(Request $request, Claim $claim): JsonResponse
    {
        $claim->loadMissing('post');

        if ($request->user()->id !== $claim->recipientId()) {
            return response()->json(['error' => 'Only the item recipient can confirm receipt.'], 403);
        }

        if ($claim->status !== 'accepted') {
            return response()->json([
                'error' => 'The item must be verified before it can be confirmed as received.',
                'claim' => $this->formatClaim($claim),
            ], 422);
        }

        $claim->update(['status' => 'completed']);
        $claim->post->update(['status' => 'resolved']);

        $claim->load([
            'claimant:id,name,username,profile_icon',
            'owner:id,name,username,profile_icon',
        ]);

        // The recipient (caller) will rate the holder/finder of the item.
        $holderId = $claim->holderId();
        $ratee = $holderId === $claim->owner_id ? $claim->owner : $claim->claimant;

        return response()->json([
            'success' => true,
            'claim' => $this->formatClaim($claim) + [
                'ratee' => $ratee,
                'claimant' => $claim->claimant,
            ],
        ]);
    }

    /**
     * Whether a user is a party to this claim (owner or claimant).
     */
    private function isParticipant(int $userId, Claim $claim): bool
    {
        return $userId === $claim->owner_id || $userId === $claim->claimant_id;
    }

    /**
     * The claimant's intro message posted once on their first chat follow-up:
     * their request note (from the "Submit a Request" modal) when present,
     * otherwise a default English message based on the post type.
     */
    private function introMessageBody(Claim $claim): string
    {
        $requestNote = trim((string) $claim->message);

        if ($requestNote !== '') {
            return $requestNote;
        }

        return $claim->post->type === 'found'
            ? 'Hi! I believe this item is mine. 🙏'
            : 'Hi! I think I found this item. 🙏';
    }

    /**
     * Post a plain text message into the claim's conversation.
     */
    private function postActionMessage(Claim $claim, int $userId, string $body): void
    {
        $conversation = Conversation::findOrCreateBetween($claim->owner_id, $claim->claimant_id);

        $message = $conversation->messages()->create([
            'user_id' => $userId,
            'body' => $body,
            'type' => 'text',
        ]);

        $message->load('sender:id,name,username,profile_icon');

        broadcast(new MessageSent($message))->toOthers();

        $conversation->load('participants');
        broadcast(new ConversationUpdated($conversation, [
            'id' => $message->id,
            'body' => $message->body,
            'type' => $message->type,
            'sender_id' => $message->user_id,
            'sender_name' => $message->sender->name,
            'created_at' => $message->created_at->toISOString(),
        ]))->toOthers();

        $conversation->participants()
            ->updateExistingPivot($userId, ['last_read_at' => now()]);
    }

    /**
     * Format claim for JSON response.
     */
    private function formatClaim(Claim $claim): array
    {
        return [
            'id' => $claim->id,
            'post_id' => $claim->post_id,
            'claimant_id' => $claim->claimant_id,
            'owner_id' => $claim->owner_id,
            'status' => $claim->status,
            'message' => $claim->message,
            'created_at' => $claim->created_at->toISOString(),
        ];
    }
}
