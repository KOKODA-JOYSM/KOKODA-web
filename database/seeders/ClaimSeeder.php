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
            $adminPostTemplates = [
                ['title' => 'Found gray backpack', 'type' => 'found'],
                ['title' => 'Lost student card near gate', 'type' => 'lost'],
                ['title' => 'Found black wallet at cafeteria', 'type' => 'found'],
                ['title' => 'Lost house keys with blue tag', 'type' => 'lost'],
                ['title' => 'Found umbrella in lobby', 'type' => 'found'],
                ['title' => 'Lost notebook with red cover', 'type' => 'lost'],
            ];

            foreach ($adminPostTemplates as $template) {
                Post::updateOrCreate(
                    ['title' => $template['title'], 'user_id' => $admin->id],
                    [
                        'type' => $template['type'],
                        'status' => 'active',
                        'description' => 'Seeded admin post for claim testing.',
                    ]
                );
            }

            $adminPosts = Post::query()->where('user_id', $admin->id)->get();
        }

        $statuses = ['pending', 'accepted', 'rejected', 'completed'];
        $now = now();
        $claims = [];
        $usedPairs = [];

        foreach ($adminPosts as $post) {
            foreach ($allUsers->shuffle()->take(2) as $claimant) {
                $pairKey = $post->id . ':' . $claimant->id;
                if (isset($usedPairs[$pairKey])) {
                    continue;
                }

                $claims[] = [
                    'post_id' => $post->id,
                    'claimant_id' => $claimant->id,
                    'owner_id' => $admin->id,
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
