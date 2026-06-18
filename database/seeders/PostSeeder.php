<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::query()->pluck('id');

        if ($userIds->isEmpty()) {
            User::create([
                'name' => 'User One',
                'username' => 'user1',
                'email' => 'user1@example.com',
                'password' => bcrypt('password'),
            ]);
            User::create([
                'name' => 'User Two',
                'username' => 'user2',
                'email' => 'user2@example.com',
                'password' => bcrypt('password'),
            ]);
            User::create([
                'name' => 'User Three',
                'username' => 'user3',
                'email' => 'user3@example.com',
                'password' => bcrypt('password'),
            ]);

            $userIds = User::query()->pluck('id');
        }

        $locations = Location::query()->orderBy('id')->get();
        if ($locations->isEmpty()) {
            return;
        }

        $postTemplates = [
            [
                'title' => 'Lost black wallet',
                'description' => 'Lost a black wallet with several cards. Please contact me if found.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found keys with red keychain',
                'description' => 'Found a set of keys with a red keychain in the area.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost white earbuds',
                'description' => 'Left white earbuds around the location. Please contact me if found.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found blue backpack',
                'description' => 'Blue backpack with notebooks found nearby.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost silver watch',
                'description' => 'Silver watch lost around the area.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found student ID card',
                'description' => 'Found a student ID card on the ground.',
                'type' => 'found',
                'status' => 'active',
            ],
        ];

        foreach ($locations as $index => $location) {
            $template = $postTemplates[$index % count($postTemplates)];
            $title = $template['title'].' near '.$location->place_name;

            Post::updateOrCreate(
                ['location_id' => $location->id],
                [
                    'user_id' => $location->user_id,
                    'title' => $title,
                    'description' => $template['description'],
                    'type' => $template['type'],
                    'status' => $template['status'],
                ]
            );
        }
    }
}
