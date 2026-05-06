<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'John Liberto', 'email' => 'john.liberto@example.com', 'points' => 45],
            ['name' => 'Jennifer Blue', 'email' => 'jennifer.blue@example.com', 'points' => 40],
            ['name' => 'Dominic Cole', 'email' => 'dominic.cole@example.com', 'points' => 38],
            ['name' => 'Joe Stanford', 'email' => 'joe.stanford@example.com', 'points' => 36],
            ['name' => 'Juhoon Cotis', 'email' => 'juhoon.cotis@example.com', 'points' => 35],
            ['name' => 'Lucas Sterling', 'email' => 'lucas.sterling@example.com', 'points' => 35],
            ['name' => 'Dominic Vane', 'email' => 'dominic.vane@example.com', 'points' => 33],
            ['name' => 'Silas Thorne', 'email' => 'silas.thorne@example.com', 'points' => 32],
            ['name' => 'Marcus Rhodes', 'email' => 'marcus.rhodes@example.com', 'points' => 31],
            ['name' => 'Nathaniel Cole', 'email' => 'nathaniel.cole@example.com', 'points' => 29],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => bcrypt('password'),
                'points' => $user['points'],
            ]);
        }

        User::create([
            'name' => 'Joysm',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'points' => 35,
        ]);
    }
}
