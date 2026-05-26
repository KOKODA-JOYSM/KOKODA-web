<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Database\Seeders\LocationSeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\ClaimSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminUsername = $this->makeUniqueUsername('admin', 'admin@gmail.com');

        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'username' => $adminUsername,
                'password' => Hash::make('admin'),
                'profile_icon' => 'avatar-admin.png',
                'phone_number' => '081200000000',
                'location' => 'Jakarta',
                'points' => 15,
                'rating' => 5.0,
            ]
        );

        $users = [
            [
                'name' => 'John Liberto',
                'email' => 'john.liberto@example.com',
                'profile_icon' => 'avatar-1.png',
                'phone_number' => '081200000001',
                'location' => 'Bogor',
                'points' => 45,
                'rating' => 4.7,
            ],
            [
                'name' => 'Jennifer Blue',
                'email' => 'jennifer.blue@example.com',
                'profile_icon' => 'avatar-2.png',
                'phone_number' => '081200000002',
                'location' => 'Depok',
                'points' => 40,
                'rating' => 4.5,
            ],
            [
                'name' => 'Dominic Cole',
                'email' => 'dominic.cole@example.com',
                'profile_icon' => 'avatar-3.png',
                'phone_number' => '081200000003',
                'location' => 'Bekasi',
                'points' => 38,
                'rating' => 4.4,
            ],
            [
                'name' => 'Joe Stanford',
                'email' => 'joe.stanford@example.com',
                'profile_icon' => 'avatar-4.png',
                'phone_number' => '081200000004',
                'location' => 'Tangerang',
                'points' => 36,
                'rating' => 4.2,
            ],
            [
                'name' => 'Juhoon Cotis',
                'email' => 'juhoon.cotis@example.com',
                'profile_icon' => 'avatar-5.png',
                'phone_number' => '081200000005',
                'location' => 'Bogor',
                'points' => 35,
                'rating' => 4.1,
            ],
            [
                'name' => 'Lucas Sterling',
                'email' => 'lucas.sterling@example.com',
                'profile_icon' => 'avatar-6.png',
                'phone_number' => '081200000006',
                'location' => 'Bekasi',
                'points' => 35,
                'rating' => 4.0,
            ],
            [
                'name' => 'Dominic Vane',
                'email' => 'dominic.vane@example.com',
                'profile_icon' => 'avatar-7.png',
                'phone_number' => '081200000007',
                'location' => 'Jakarta',
                'points' => 33,
                'rating' => 3.9,
            ],
            [
                'name' => 'Silas Thorne',
                'email' => 'silas.thorne@example.com',
                'profile_icon' => 'avatar-8.png',
                'phone_number' => '081200000008',
                'location' => 'Bandung',
                'points' => 32,
                'rating' => 3.8,
            ],
            [
                'name' => 'Marcus Rhodes',
                'email' => 'marcus.rhodes@example.com',
                'profile_icon' => 'avatar-9.png',
                'phone_number' => '081200000009',
                'location' => 'Bandung',
                'points' => 31,
                'rating' => 3.7,
            ],
            [
                'name' => 'Nathaniel Cole',
                'email' => 'nathaniel.cole@example.com',
                'profile_icon' => 'avatar-10.png',
                'phone_number' => '081200000010',
                'location' => 'Surabaya',
                'points' => 29,
                'rating' => 3.6,
            ],
            [
                'name' => 'Kim Bro',
                'email' => 'kimbro.cole@example.com',
                'profile_icon' => 'avatar-11.png',
                'phone_number' => '081200000011',
                'location' => 'Medan',
                'points' => 28,
                'rating' => 3.5,
            ],
        ];

        foreach ($users as $user) {
            $username = $this->makeUniqueUsername($user['name'], $user['email']);
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'username' => $username,
                    'password' => Hash::make('password'),
                    'profile_icon' => $user['profile_icon'],
                    'phone_number' => $user['phone_number'],
                    'location' => $user['location'],
                    'points' => $user['points'],
                    'rating' => $user['rating'],
                ]
            );
        }

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Joysm',
                'username' => $this->makeUniqueUsername('Joysm', 'test@example.com'),
                'password' => Hash::make('password'),
                'profile_icon' => 'avatar-12.png',
                'phone_number' => '081200000012',
                'location' => 'Yogyakarta',
                'points' => 35,
                'rating' => 4.3,
            ]
        );

        $this->call([
            LocationSeeder::class,
            PostSeeder::class,
            ClaimSeeder::class,
        ]);
    }

    private function makeUniqueUsername(string $name, string $email): string
    {
        $existing = User::query()->where('email', $email)->first();
        if ($existing && !empty($existing->username)) {
            return $existing->username;
        }

        $base = Str::slug($name);
        if ($base === '') {
            $base = Str::before($email, '@');
        }

        $username = $base;
        $suffix = 1;
        while (User::query()->where('username', $username)->exists()) {
            $username = $base . $suffix;
            $suffix++;
        }

        return $username;
    }
}
