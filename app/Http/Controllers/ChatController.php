<?php

namespace App\Http\Controllers;

use App\Events\ConversationUpdated;
use App\Events\MessageSent;
use App\Events\MessagesRead;
use App\Events\UserTyping;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    /**
     * Render halaman chat utama via Inertia.
     * Kirim data conversations awal + auth user supaya halaman
     * tidak perlu request tambahan saat pertama kali load.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = $this->getConversationsForUser($user);

        return Inertia::render('Chat/Chat', [
            'initialConversations' => $conversations,
            'targetUserId' => $request->query('user'),
        ]);
    }

    /**
     * API: List semua conversations milik user (JSON).
     * Digunakan untuk refresh/polling dan real-time updates.
     */
    public function conversations(Request $request): JsonResponse
    {
        $conversations = $this->getConversationsForUser($request->user());

        return response()->json($conversations);
    }

    /**
     * API: List messages dalam sebuah conversation (cursor-paginated).
     */
    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        // Pastikan user adalah participant
        $this->authorizeParticipant($request->user(), $conversation);

        $query = $conversation->messages()
            ->with('sender:id,name,username,profile_icon')
            ->orderBy('created_at', 'desc');

        // Cursor pagination: load pesan lebih lama dari cursor
        $before = $request->query('before');
        if ($before) {
            $query->where('id', '<', $before);
        }

        $messages = $query->take(50)->get()->reverse()->values();

        $hasMore = $conversation->messages()
            ->when($messages->isNotEmpty(), fn($q) => $q->where('id', '<', $messages->first()->id))
            ->exists();

        return response()->json([
            'messages' => $messages->map(fn(Message $msg) => $this->formatMessage($msg, $request->user()->id)),
            'has_more' => $hasMore,
        ]);
    }

    /**
     * API: Kirim pesan baru ke conversation.
     */
    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorizeParticipant($request->user(), $conversation);

        $validated = $request->validate([
            'body' => 'required|string|max:5000',
            'type' => 'sometimes|in:text,image,system',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'type' => $validated['type'] ?? 'text',
        ]);

        $message->load('sender:id,name,username,profile_icon');

        // Broadcast pesan ke semua participant di conversation channel
        broadcast(new MessageSent($message))->toOthers();

        // Broadcast update ke user channels (untuk update conversation list)
        $conversation->load('participants');
        broadcast(new ConversationUpdated($conversation, [
            'id' => $message->id,
            'body' => $message->body,
            'type' => $message->type,
            'sender_id' => $message->user_id,
            'sender_name' => $message->sender->name,
            'created_at' => $message->created_at->toISOString(),
        ]))->toOthers();

        // Update last_read_at untuk sender (dia sudah baca karena dia yang kirim)
        $conversation->participants()
            ->updateExistingPivot($request->user()->id, [
                'last_read_at' => now(),
            ]);

        return response()->json([
            'message' => $this->formatMessage($message, $request->user()->id),
        ], 201);
    }

    /**
     * API: Mulai atau dapatkan conversation dengan user tertentu.
     */
    public function startConversation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $authUser = $request->user();
        $targetUserId = (int) $validated['user_id'];

        // Tidak bisa chat dengan diri sendiri
        if ($authUser->id === $targetUserId) {
            return response()->json(['error' => 'Tidak bisa chat dengan diri sendiri.'], 422);
        }

        $conversation = Conversation::findOrCreateBetween($authUser->id, $targetUserId);
        $conversation->load(['participants', 'latestMessage.sender']);

        $otherUser = $conversation->getOtherParticipant($authUser->id);

        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'other_user' => $otherUser ? [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'username' => $otherUser->username,
                    'profile_icon' => $otherUser->profile_icon,
                ] : null,
                'last_message' => $conversation->latestMessage
                    ? $this->formatMessagePreview($conversation->latestMessage)
                    : null,
                'unread_count' => $conversation->unreadCountFor($authUser->id),
                'created_at' => $conversation->created_at->toISOString(),
            ],
        ], 200);
    }

    /**
     * API: Mark conversation sebagai dibaca oleh user.
     */
    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorizeParticipant($request->user(), $conversation);

        $now = now();

        $conversation->participants()
            ->updateExistingPivot($request->user()->id, [
                'last_read_at' => $now,
            ]);

        // Broadcast read receipt ke conversation channel
        broadcast(new MessagesRead(
            $conversation->id,
            $request->user()->id,
            $now->toISOString()
        ))->toOthers();

        return response()->json(['success' => true]);
    }

    /**
     * API: Broadcast typing indicator.
     */
    public function typing(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorizeParticipant($request->user(), $conversation);

        $validated = $request->validate([
            'is_typing' => 'required|boolean',
        ]);

        broadcast(new UserTyping(
            $conversation->id,
            $request->user()->id,
            $request->user()->name,
            $validated['is_typing']
        ))->toOthers();

        return response()->json(['success' => true]);
    }

    /**
     * API: Search users untuk memulai conversation baru.
     */
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->query('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('id', '!=', $request->user()->id)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%");
            })
            ->take(10)
            ->get(['id', 'name', 'username', 'profile_icon']);

        return response()->json($users);
    }

    // ─────────────────────────────────────────────────────────────
    // HELPER METHODS
    // ─────────────────────────────────────────────────────────────

    /**
     * Pastikan user adalah participant conversation.
     */
    private function authorizeParticipant(User $user, Conversation $conversation): void
    {
        $isParticipant = $conversation->participants()
            ->where('user_id', $user->id)
            ->exists();

        if (!$isParticipant) {
            abort(403, 'Kamu bukan peserta conversation ini.');
        }
    }

    /**
     * Ambil semua conversations milik user, lengkap dengan data yang dibutuhkan frontend.
     */
    private function getConversationsForUser(User $user): array
    {
        $conversations = $user->conversations()
            ->with(['participants', 'latestMessage.sender'])
            ->get()
            ->sortByDesc(function ($conv) {
                return $conv->latestMessage?->created_at ?? $conv->created_at;
            })
            ->values();

        return $conversations->map(function (Conversation $conv) use ($user) {
            $otherUser = $conv->getOtherParticipant($user->id);

            return [
                'id' => $conv->id,
                'other_user' => $otherUser ? [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'username' => $otherUser->username,
                    'profile_icon' => $otherUser->profile_icon,
                ] : null,
                'last_message' => $conv->latestMessage
                    ? $this->formatMessagePreview($conv->latestMessage)
                    : null,
                'unread_count' => $conv->unreadCountFor($user->id),
                'created_at' => $conv->created_at->toISOString(),
            ];
        })->toArray();
    }

    /**
     * Format pesan untuk response API.
     */
    private function formatMessage(Message $message, int $authUserId): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'user_id' => $message->user_id,
            'body' => $message->body,
            'type' => $message->type,
            'is_own' => $message->user_id === $authUserId,
            'created_at' => $message->created_at->toISOString(),
            'sender' => [
                'id' => $message->sender->id,
                'name' => $message->sender->name,
                'username' => $message->sender->username,
                'profile_icon' => $message->sender->profile_icon,
            ],
        ];
    }

    /**
     * Format pesan untuk preview di conversation list.
     */
    private function formatMessagePreview(Message $message): array
    {
        return [
            'id' => $message->id,
            'body' => $message->body,
            'type' => $message->type,
            'sender_id' => $message->user_id,
            'sender_name' => $message->sender->name ?? 'Unknown',
            'created_at' => $message->created_at->toISOString(),
        ];
    }
}
