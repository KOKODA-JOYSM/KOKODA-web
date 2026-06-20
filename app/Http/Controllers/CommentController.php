<?php

namespace App\Http\Controllers;

use App\Events\CommentDeleted;
use App\Events\CommentPosted;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    /**
     * Fetch all top-level comments for a post, ordered oldest-first.
     * Public — no auth required (any visitor can read comments).
     */
    public function index(Post $post)
    {
        $comments = Comment::with('user')
            ->where('post_id', $post->id)
            ->whereNull('parent_id')   // top-level only for now
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($comment) {
                return [
                    'id'         => $comment->id,
                    'post_id'    => $comment->post_id,
                    'user_id'    => $comment->user_id,
                    'parent_id'  => $comment->parent_id,
                    'text'       => $comment->text,
                    'created_at' => $comment->created_at->toISOString(),
                    'user' => [
                        'id'           => $comment->user->id,
                        'name'         => $comment->user->name,
                        'username'     => $comment->user->username,
                        'profile_icon' => $comment->user->profile_icon,
                    ],
                ];
            });

        return response()->json($comments);
    }

    /**
     * Store a new comment on a post.
     * Auth required — only logged-in users can comment.
     */
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'text'      => 'required|string|max:2000',
            'parent_id' => 'nullable|integer|exists:comments,id',
        ]);

        $comment = Comment::create([
            'post_id'   => $post->id,
            'user_id'   => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'text'      => $validated['text'],
        ]);

        // Load the user relationship for the broadcast payload
        $comment->load('user');

        // Broadcast the new comment to all clients viewing this post.
        // Real-time delivery is a "nice to have", not a hard requirement.
        // On environments where the Reverb websocket server isn't running
        // (e.g. Azure App Service) the broadcast would otherwise throw and
        // turn a successful comment into a 500 error. We swallow that failure
        // so the comment is still saved and returned — clients simply fall
        // back to fetching the comment list on their next open/refresh.
        try {
            broadcast(new CommentPosted($comment))->toOthers();
        } catch (\Throwable $e) {
            Log::warning('Comment broadcast failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json([
            'id'         => $comment->id,
            'post_id'    => $comment->post_id,
            'user_id'    => $comment->user_id,
            'parent_id'  => $comment->parent_id,
            'text'       => $comment->text,
            'created_at' => $comment->created_at->toISOString(),
            'user' => [
                'id'           => $comment->user->id,
                'name'         => $comment->user->name,
                'username'     => $comment->user->username,
                'profile_icon' => $comment->user->profile_icon,
            ],
        ], 201);
    }

    /**
     * Delete a comment. Only the comment author or post owner may delete.
     */
    public function destroy(Post $post, Comment $comment)
    {
        $user = Auth::user();

        if ($comment->user_id !== $user->id && $post->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $commentId = $comment->id;
        $postId    = $post->id;

        $comment->delete();

        // Broadcast the deletion so every other client viewing this post
        // removes the comment from their list in real-time. Non-fatal:
        // if Reverb is unavailable the delete still succeeds.
        try {
            broadcast(new CommentDeleted($commentId, $postId))->toOthers();
        } catch (\Throwable $e) {
            Log::warning('Comment-delete broadcast failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
