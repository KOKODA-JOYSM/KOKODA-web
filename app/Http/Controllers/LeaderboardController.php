<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Build the leaderboard data collection.
     */
    private function buildLeaderboard()
    {
        return User::query()
            ->orderByDesc('points')
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'points', 'profile_icon', 'rating', 'location'])
            ->map(function ($user, $index) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'points' => $user->points ?? 0,
                    'rank' => $index + 1,
                    'profile_picture' => $user->profile_icon
                        ? '/'.$user->profile_icon
                        : null,
                ];
            });
    }

    /**
     * JSON API endpoint for the leaderboard.
     */
    public function index(): JsonResponse
    {
        $leaderboard = $this->buildLeaderboard();

        $user = auth()->user();
        $currentUserRank = null;

        if ($user) {
            $currentUserRank = $leaderboard->firstWhere('id', $user->id);
            if (! $currentUserRank) {
                $currentUserRank = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'points' => $user->points ?? 0,
                    'rank' => $leaderboard->count() + 1,
                    'profile_picture' => $user->profile_icon
                        ? '/'.$user->profile_icon
                        : null,
                ];
            }
        }

        return response()->json([
            'leaderboard' => $leaderboard->values()->all(),
            'currentUser' => $currentUserRank,
        ]);
    }

    /**
     * Inertia page – passes data as props so the page renders immediately.
     */
    public function show(): Response
    {
        $leaderboard = $this->buildLeaderboard();

        $user = auth()->user();
        $currentUserRank = null;

        if ($user) {
            $currentUserRank = $leaderboard->firstWhere('id', $user->id);
            if (! $currentUserRank) {
                $currentUserRank = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'points' => $user->points ?? 0,
                    'rank' => $leaderboard->count() + 1,
                    'profile_picture' => $user->profile_icon
                        ? '/'.$user->profile_icon
                        : null,
                ];
            }
        }

        return Inertia::render('Leaderboard', [
            'leaderboard' => $leaderboard->values()->all(),
            'currentUser' => $currentUserRank,
        ]);
    }
}
