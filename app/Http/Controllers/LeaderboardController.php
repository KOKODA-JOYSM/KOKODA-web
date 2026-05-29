<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Inertia\Response;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index(): JsonResponse
    {
        $leaderboard = User::query()
            ->orderByDesc('points')
            ->orderBy('name')
            ->get(['id', 'name', 'points'])
            ->map(function ($user, $index) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'points' => $user->points,
                    'rank' => $index + 1,
                ];
            });

        $user = auth()->user();
        $currentUserRank = null;

        if ($user) {
            $currentUserRank = $leaderboard->firstWhere('id', $user->id);
            if (!$currentUserRank) {
                $currentUserRank = [
                    'id' => $user->id,
                    'name' => $user->name,
                    'points' => $user->points ?? 0,
                    'rank' => $leaderboard->count() + 1,
                ];
            }
        }

        return response()->json([
            'leaderboard' => $leaderboard->values()->all(),
            'currentUser' => $currentUserRank,
        ]);
    }

    public function show(): Response
    {
        return Inertia::render('Leaderboard');
    }
}
