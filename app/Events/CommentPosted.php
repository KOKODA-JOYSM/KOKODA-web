<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentPosted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Comment $comment)
    {
        $this->comment->load('user');
    }

    /**
     * Broadcast on a public channel so all users viewing the post
     * receive the new comment in real-time without channel auth.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('post.' . $this->comment->post_id);
    }

    /**
     * Event name received in the frontend.
     */
    public function broadcastAs(): string
    {
        return 'comment.posted';
    }

    /**
     * Payload sent to the client.
     */
    public function broadcastWith(): array
    {
        return [
            'comment' => [
                'id'         => $this->comment->id,
                'post_id'    => $this->comment->post_id,
                'user_id'    => $this->comment->user_id,
                'parent_id'  => $this->comment->parent_id,
                'text'       => $this->comment->text,
                'created_at' => $this->comment->created_at->toISOString(),
                'user' => [
                    'id'           => $this->comment->user->id,
                    'name'         => $this->comment->user->name,
                    'username'     => $this->comment->user->username,
                    'profile_icon' => $this->comment->user->profile_icon,
                ],
            ],
        ];
    }
}
