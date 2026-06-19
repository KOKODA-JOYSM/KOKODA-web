<?php

namespace App\Http\Controllers;

use App\Models\Claim;
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

        // Check if user has already claimed this post
        $existingClaim = Claim::where('post_id', $post->id)
            ->where('claimant_id', $user->id)
            ->first();

        if ($existingClaim) {
            return response()->json([
                'error' => 'You have already submitted a request for this post.',
                'claim' => $this->formatClaim($existingClaim),
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
