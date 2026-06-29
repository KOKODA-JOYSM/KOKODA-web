<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Rating;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Submit a rating for a completed claim.
     * The post owner rates the claimant.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'claim_id'    => 'required|integer|exists:claims,id',
            'score'       => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:500',
        ]);

        $claim = Claim::findOrFail($validated['claim_id']);

        if ($request->user()->id !== $claim->owner_id) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        if ($claim->status !== 'completed') {
            return response()->json(['error' => 'Claim must be completed before rating.'], 422);
        }

        if (Rating::where('claim_id', $claim->id)->exists()) {
            return response()->json(['error' => 'Rating already submitted.'], 409);
        }

        $rating = Rating::create([
            'claim_id'    => $claim->id,
            'rater_id'    => $request->user()->id,
            'ratee_id'    => $claim->claimant_id,
            'score'       => $validated['score'],
            'point'       => $validated['score'] * 2,
            'review_text' => $validated['review_text'] ?? null,
        ]);

        return response()->json(['success' => true, 'rating' => $rating], 201);
    }
}
