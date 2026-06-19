<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $commentId,
        public int $postId,
    ) {}

    /**
     * Broadcast on the same public channel used for new comments so all
     * users viewing the post see the comment disappear in real-time.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('post.' . $this->postId);
    }

    /**
     * Event name received in the frontend.
     */
    public function broadcastAs(): string
    {
        return 'comment.deleted';
    }

    /**
     * Payload sent to the client.
     */
    public function broadcastWith(): array
    {
        return [
            'id'      => $this->commentId,
            'post_id' => $this->postId,
        ];
    }
}
