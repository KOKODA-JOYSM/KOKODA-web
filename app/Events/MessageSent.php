<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
        $this->message->load('sender');
    }

    /**
     * Broadcast ke private channel conversation.
     */
    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('conversation.'.$this->message->conversation_id);
    }

    /**
     * Nama event yang akan diterima di frontend.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Data yang dikirim ke client.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'user_id' => $this->message->user_id,
                'body' => $this->message->body,
                'type' => $this->message->type,
                'meta' => $this->message->meta,
                'image_url' => $this->message->image_url,
                'created_at' => $this->message->created_at->toISOString(),
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                    'username' => $this->message->sender->username,
                    'profile_icon' => $this->message->sender->profile_icon,
                ],
            ],
        ];
    }
}
