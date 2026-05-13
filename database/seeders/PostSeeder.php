<?php

namespace Database\Seeders;

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
                'email' => 'user1@example.com',
                'password' => bcrypt('password'),
            ]);
            User::create([
                'name' => 'User Two',
                'email' => 'user2@example.com',
                'password' => bcrypt('password'),
            ]);
            User::create([
                'name' => 'User Three',
                'email' => 'user3@example.com',
                'password' => bcrypt('password'),
            ]);

            $userIds = User::query()->pluck('id');
        }

        // 20 sample lost and found posts
        $posts = [
            [
                'title' => 'Lost black wallet near city mall',
                'description' => 'Lost a black wallet with several cards. Last seen near the main entrance.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found keys with red keychain',
                'description' => 'Found a set of keys with a red keychain near the bus stop.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost white earbuds in library',
                'description' => 'Left white earbuds in the reading room. Please contact me if found.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found blue backpack on campus',
                'description' => 'Blue backpack with notebooks and a water bottle, found near the parking lot.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost silver watch',
                'description' => 'Silver watch lost after evening jog. Might be near the river path.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found student ID card',
                'description' => 'Found an ID card in front of the cafeteria.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost brown leather belt',
                'description' => 'Lost a brown leather belt at the sports hall.',
                'type' => 'lost',
                'status' => 'resolved',
            ],
            [
                'title' => 'Found umbrella with wooden handle',
                'description' => 'Found an umbrella with a wooden handle outside the bookstore.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost phone case (green)',
                'description' => 'Green phone case with stickers. Lost near the food court.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found helmet near parking gate',
                'description' => 'Found a black helmet near the parking gate at noon.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost blue notebook',
                'description' => 'Lost a blue notebook with class notes in Room 204.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found power bank',
                'description' => 'Found a power bank under a bench near the park.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost ring with small stone',
                'description' => 'Lost a ring with a small stone near the auditorium.',
                'type' => 'lost',
                'status' => 'resolved',
            ],
            [
                'title' => 'Found sunglasses at cafe',
                'description' => 'Found sunglasses on a table at the campus cafe.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost charger cable',
                'description' => 'Lost a USB-C charger cable in the computer lab.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found water bottle with stickers',
                'description' => 'Found a water bottle with stickers at the gym.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost black hoodie',
                'description' => 'Lost a black hoodie after practice. Size L.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found pencil case',
                'description' => 'Found a pencil case with pens and markers near Room 101.',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost bus card',
                'description' => 'Lost a bus card with my name on the back.',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found laptop charger',
                'description' => 'Found a laptop charger in the meeting room.',
                'type' => 'found',
                'status' => 'active',
            ],
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(
                ['title' => $post['title']],
                [
                    'user_id' => $userIds->random(),
                    'description' => $post['description'],
                    'type' => $post['type'],
                    'status' => $post['status'],
                ]
            );
        }
    }
}
