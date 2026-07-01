<?php

namespace App\Http\Controllers;

use App\Events\ConversationUpdated;
use App\Events\MessageSent;
use App\Models\Claim;
use App\Models\Conversation;
use App\Models\Post;
use App\Models\User;
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
     * The most recent still-in-flight claim (pending/accepted, post active)
     * between the auth user and $user, in EITHER direction. Powers the little
     * chat pop-up that lets a user re-surface their handshake card without
     * leaving the chat. Returns null when the two aren't mid-transaction.
     */
    public function activeWith(Request $request, User $user): JsonResponse
    {
        $authId = $request->user()->id;

        $claim = Claim::with('post')
            ->where(function ($q) use ($authId, $user) {
                $q->where(function ($qq) use ($authId, $user) {
                    $qq->where('claimant_id', $authId)->where('owner_id', $user->id);
                })->orWhere(function ($qq) use ($authId, $user) {
                    $qq->where('owner_id', $authId)->where('claimant_id', $user->id);
                });
            })
            ->whereIn('status', ['pending', 'accepted'])
            ->whereHas('post', fn ($q) => $q->where('status', 'active'))
            ->latest('id')
            ->first();

        if (! $claim) {
            return response()->json(['claim' => null]);
        }

        return response()->json([
            'claim' => [
                'id' => $claim->id,
                'status' => $claim->status,
                // Which card THIS user would act on (verify vs receive).
                'template' => $claim->templateFor($authId),
                'post' => [
                    'id' => $claim->post->id,
                    'title' => $claim->post->title,
                    'image_url' => $claim->post->image_url,
                    'type' => $claim->post->type,
                ],
            ],
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

        // Surface BOTH handshake cards so each party has their OWN actionable
        // card, regardless of who pressed "continue by chat" first: the holder's
        // verification card and the recipient's received card, each authored by
        // its actor so it aligns to that person's side. A fresh copy is posted
        // each time so it re-surfaces at the bottom; the client renders only the
        // latest per (claim, template), so this never shows as a double. Chatting
        // directly from the conversation list doesn't hit this endpoint, so no
        // card appears there.
        $this->createCard($conversation, $claim, 'verification', $claim->holderId());
        $this->createCard($conversation, $claim, 'received', $claim->recipientId());

        // Sender has obviously "read" their own card.
        $conversation->participants()
            ->updateExistingPivot($user->id, ['last_read_at' => now()]);

        return response()->json([
            'success' => true,
            'conversation_id' => $conversation->id,
        ], 201);
    }

    /**
     * Post a handshake card for a claim and broadcast it to the other
     * participant. Authored by the role that acts on it (holder → verification,
     * recipient → received) so it aligns to that person's side of the chat.
     *
     * A fresh card is posted on every follow-up so it RE-SURFACES at the bottom
     * of the conversation (that's the whole point of the chat pop-up / "continue
     * by chat"). Duplicates are collapsed on the client — only the latest card
     * per (claim, template) is rendered — so this never shows as a double.
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
     * Holder verifies the item is genuine — one side of a TWO-WAY handshake.
     * Independent of the recipient's "received" press and pressable in any
     * order. The claim only completes (and the post resolves) once BOTH sides
     * have confirmed.
     */
    public function verify(Request $request, Claim $claim): JsonResponse
    {
        $claim->loadMissing('post');

        if ($request->user()->id !== $claim->holderId()) {
            return response()->json(['error' => 'Only the item holder can verify.'], 403);
        }

        if (in_array($claim->status, ['rejected', 'completed'], true)) {
            return response()->json([
                'error' => 'This request can no longer be verified.',
                'claim' => $this->formatClaim($claim),
            ], 422);
        }

        if (! $claim->verified_at) {
            $claim->verified_at = now();
            $this->settleHandshake($claim);
        }

        return response()->json([
            'success' => true,
            'claim' => $this->formatClaim($claim),
        ]);
    }

    /**
     * Recipient confirms they received the item — the other side of the two-way
     * handshake. Pressable directly (not gated on verification). The rating is
     * returned ONLY when this press completes the handshake (the holder has
     * already verified); otherwise it waits for the holder's verification.
     */
    public function receive(Request $request, Claim $claim): JsonResponse
    {
        $claim->loadMissing('post');

        if ($request->user()->id !== $claim->recipientId()) {
            return response()->json(['error' => 'Only the item recipient can confirm receipt.'], 403);
        }

        if (in_array($claim->status, ['rejected', 'completed'], true)) {
            return response()->json([
                'error' => 'This request can no longer be updated.',
                'claim' => $this->formatClaim($claim),
            ], 422);
        }

        if (! $claim->received_at) {
            $claim->received_at = now();
            $this->settleHandshake($claim);
        }

        $payload = $this->formatClaim($claim);

        // Rating is triggered only once BOTH sides have confirmed (2-arah).
        if ($claim->status === 'completed') {
            $claim->load([
                'claimant:id,name,username,profile_icon',
                'owner:id,name,username,profile_icon',
            ]);

            $holderId = $claim->holderId();
            $ratee = $holderId === $claim->owner_id ? $claim->owner : $claim->claimant;

            $payload += ['ratee' => $ratee, 'claimant' => $claim->claimant];
        }

        return response()->json([
            'success' => true,
            'claim' => $payload,
        ]);
    }

    /**
     * Advance a claim's status from its two handshake timestamps: 'completed'
     * (both sides confirmed → resolve the post), 'accepted' (one side confirmed,
     * in progress) or left as-is. Persists the claim; the caller supplies the
     * freshly-set timestamp on $claim.
     */
    private function settleHandshake(Claim $claim): void
    {
        if ($claim->verified_at && $claim->received_at) {
            $claim->status = 'completed';
        } elseif ($claim->status === 'pending') {
            $claim->status = 'accepted';
        }

        $claim->save();

        if ($claim->status === 'completed') {
            $claim->post->update(['status' => 'resolved']);
        }
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
