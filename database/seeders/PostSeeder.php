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
        $locations = ['City Mall', 'Bus Stop', 'Campus Library', 'Parking Lot', 'River Path',
            'Cafeteria', 'Sports Hall', 'Bookstore', 'Food Court', 'Parking Gate',
            'Room 204', 'Park Bench', 'Auditorium', 'Campus Cafe', 'Computer Lab',
            'Gym', 'Practice Field', 'Room 101', 'Train Station', 'Meeting Room'];

        $categories = ['Wallet', 'Keys', 'Electronics', 'Bag', 'Accessory',
            'ID Card', 'Clothing', 'Stationery', 'Card', 'Electronics'];

        $posts = [
            [
                'title' => 'Lost black wallet near city mall',
                'description' => 'Lost a black wallet with several cards. Last seen near the main entrance.',
                'location' => 'City Mall',
                'category' => 'Wallet',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found keys with red keychain',
                'description' => 'Found a set of keys with a red keychain near the bus stop.',
                'location' => 'Bus Stop',
                'category' => 'Keys',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost white earbuds in library',
                'description' => 'Left white earbuds in the reading room. Please contact me if found.',
                'location' => 'Campus Library',
                'category' => 'Electronics',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found blue backpack on campus',
                'description' => 'Blue backpack with notebooks and a water bottle, found near the parking lot.',
                'location' => 'Parking Lot',
                'category' => 'Bag',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost silver watch',
                'description' => 'Silver watch lost after evening jog. Might be near the river path.',
                'location' => 'River Path',
                'category' => 'Accessory',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found student ID card',
                'description' => 'Found an ID card in front of the cafeteria.',
                'location' => 'Cafeteria',
                'category' => 'ID Card',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost brown leather belt',
                'description' => 'Lost a brown leather belt at the sports hall.',
                'location' => 'Sports Hall',
                'category' => 'Clothing',
                'type' => 'lost',
                'status' => 'resolved',
            ],
            [
                'title' => 'Found umbrella with wooden handle',
                'description' => 'Found an umbrella with a wooden handle outside the bookstore.',
                'location' => 'Bookstore',
                'category' => 'Accessory',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost phone case (green)',
                'description' => 'Green phone case with stickers. Lost near the food court.',
                'location' => 'Food Court',
                'category' => 'Electronics',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found helmet near parking gate',
                'description' => 'Found a black helmet near the parking gate at noon.',
                'location' => 'Parking Gate',
                'category' => 'Accessory',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost blue notebook',
                'description' => 'Lost a blue notebook with class notes in Room 204.',
                'location' => 'Room 204',
                'category' => 'Stationery',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found power bank',
                'description' => 'Found a power bank under a bench near the park.',
                'location' => 'Park Bench',
                'category' => 'Electronics',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost ring with small stone',
                'description' => 'Lost a ring with a small stone near the auditorium.',
                'location' => 'Auditorium',
                'category' => 'Accessory',
                'type' => 'lost',
                'status' => 'resolved',
            ],
            [
                'title' => 'Found sunglasses at cafe',
                'description' => 'Found sunglasses on a table at the campus cafe.',
                'location' => 'Campus Cafe',
                'category' => 'Accessory',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost charger cable',
                'description' => 'Lost a USB-C charger cable in the computer lab.',
                'location' => 'Computer Lab',
                'category' => 'Electronics',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found water bottle with stickers',
                'description' => 'Found a water bottle with stickers at the gym.',
                'location' => 'Gym',
                'category' => 'Other',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost black hoodie',
                'description' => 'Lost a black hoodie after practice. Size L.',
                'location' => 'Practice Field',
                'category' => 'Clothing',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found pencil case',
                'description' => 'Found a pencil case with pens and markers near Room 101.',
                'location' => 'Room 101',
                'category' => 'Stationery',
                'type' => 'found',
                'status' => 'active',
            ],
            [
                'title' => 'Lost bus card',
                'description' => 'Lost a bus card with my name on the back.',
                'location' => 'Train Station',
                'category' => 'Card',
                'type' => 'lost',
                'status' => 'active',
            ],
            [
                'title' => 'Found laptop charger',
                'description' => 'Found a laptop charger in the meeting room.',
                'location' => 'Meeting Room',
                'category' => 'Electronics',
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
                    'location' => $post['location'],
                    'category' => $post['category'],
                    'type' => $post['type'],
                    'status' => $post['status'],
                ]
            );
        }
    }
}
