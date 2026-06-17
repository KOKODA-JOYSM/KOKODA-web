<?php

namespace App\Events;

use App\Models\Conversation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Conversation $conversation,
        public array $messagePreview
    ) {}

    /**
     * Broadcast ke private channel masing-masing participant
     * sehingga conversation list mereka ter-update.
     *
     * @return array<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return $this->conversation->participants
            ->map(fn($user) => new PrivateChannel('user.' . $user->id))
            ->toArray();
    }

    /**
     * Nama event yang akan diterima di frontend.
     */
    public function broadcastAs(): string
    {
        return 'conversation.updated';
    }

    /**
     * Data yang dikirim ke client.
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversation->id,
            'last_message' => $this->messagePreview,
        ];
    }
}
