<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClaimSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'admin', 'username' => 'admin', 'password' => bcrypt('admin')]
        );

        $allUsers = User::query()->where('id', '!=', $admin->id)->get();
        if ($allUsers->isEmpty()) {
            return;
        }

        $adminPosts = Post::query()->where('user_id', $admin->id)->get();
        if ($adminPosts->count() < 6) {
            $adminPosts = Post::query()->take(6)->get();
        }

        $statuses = ['pending', 'accepted', 'rejected', 'completed'];
        $now = now();
        $claims = [];
        $usedPairs = [];

        foreach ($adminPosts as $post) {
            $eligibleClaimants = $allUsers->where('id', '!=', $post->user_id);
            if ($eligibleClaimants->isEmpty()) {
                continue;
            }

            foreach ($eligibleClaimants->shuffle()->take(2) as $claimant) {
                $pairKey = $post->id . ':' . $claimant->id;
                if (isset($usedPairs[$pairKey])) {
                    continue;
                }

                $claims[] = [
                    'post_id' => $post->id,
                    'claimant_id' => $claimant->id,
                    'owner_id' => $post->user_id,
                    'status' => $statuses[array_rand($statuses)],
                    'message' => 'Seeded claim request for admin post.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $usedPairs[$pairKey] = true;
            }
        }

        $otherPosts = Post::query()
            ->where('user_id', '!=', $admin->id)
            ->take(6)
            ->get();

        foreach ($otherPosts as $post) {
            $claimant = $allUsers->where('id', '!=', $post->user_id)->random();
            $pairKey = $post->id . ':' . $claimant->id;
            if (isset($usedPairs[$pairKey])) {
                continue;
            }

            $claims[] = [
                'post_id' => $post->id,
                'claimant_id' => $claimant->id,
                'owner_id' => $post->user_id,
                'status' => $statuses[array_rand($statuses)],
                'message' => 'Seeded claim request.',
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $usedPairs[$pairKey] = true;
        }

        if (!empty($claims)) {
            DB::table('claims')->upsert(
                $claims,
                ['post_id', 'claimant_id'],
                ['owner_id', 'status', 'message', 'updated_at']
            );
        }
    }
}
