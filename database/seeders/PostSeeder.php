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
        // Get or create users
        $user1 = User::firstOrCreate(
            ['email' => 'user1@example.com'],
            ['name' => 'dorayusuke_', 'password' => bcrypt('password')]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'user2@example.com'],
            ['name' => 'kome_mlay', 'password' => bcrypt('password')]
        );

        $user3 = User::firstOrCreate(
            ['email' => 'user3@example.com'],
            ['name' => 'penermundo_sepatu', 'password' => bcrypt('password')]
        );

        // Sample lost and found posts
        $posts = [
            [
                'user_id' => $user1->id,
                'title' => 'Menemukan Dompet Skena',
                'description' => 'Halo ges, aku nemuin nih wallet berwarna hitam dengan brand terkenal, aku menemukan barang ini di area lokasi tertentu, untuk memastikan keamanan barang ini aku akan memberikan barang ini kepada yang benar-benar empunya saja.',
                'location' => 'Sentul, Bogor',
                'type' => 'found',
                'category' => 'Wallet',
                'status' => 'active',
                'image_url' => null,
            ],
            [
                'user_id' => $user2->id,
                'title' => 'DICARI!!! Kucing Kampung Coklot Bercak Hitam',
                'description' => 'Halo ges, aku nemuin nih wallet berwarna hitam dengan brand terkenal, aku menemukan barang ini di area lokasi tertentu, untuk memastikan keamanan barang ini aku akan memberikan barang ini kepada yang benar-benar empunya saja.',
                'location' => 'Bengkalis, Riau',
                'type' => 'lost',
                'category' => 'Pet',
                'status' => 'active',
                'image_url' => null,
            ],
            [
                'user_id' => $user3->id,
                'title' => 'Menemukan Sepatu Penambok Tinggi Badan',
                'description' => 'Halo ges, aku nemuin nih wallet berwarna hitam dengan brand terkenal, aku menemukan barang ini di area lokasi tertentu, untuk memastikan keamanan barang ini aku akan memberikan barang ini kepada yang benar-benar empunya saja.',
                'location' => 'Butam, Kepri',
                'type' => 'found',
                'category' => 'Shoes',
                'status' => 'active',
                'image_url' => null,
            ],
            [
                'user_id' => $user1->id,
                'title' => 'HILANG!!! Ponsel iPhone 14 Pro',
                'description' => 'Ponsel saya hilang di area mall sentul. Warna space gray dengan casing transparan. Sangat berharga bagi saya. Siapa pun yang menemukan mohon menghubungi saya segera.',
                'location' => 'Sentul, Bogor',
                'type' => 'lost',
                'category' => 'Phone',
                'status' => 'active',
                'image_url' => null,
            ],
            [
                'user_id' => $user2->id,
                'title' => 'Ditemukan Kunci Rumah dengan Gantungan Unik',
                'description' => 'Menemukan satu set kunci dengan gantungan berbentuk boneka di dekat halte bus. Kunci terlihat baru dan penting untuk pemiliknya. Hubungi saya jika ini milik Anda.',
                'location' => 'Riau, Indonesia',
                'type' => 'found',
                'category' => 'Keys',
                'status' => 'active',
                'image_url' => null,
            ],
            [
                'user_id' => $user3->id,
                'title' => 'HILANG!!! Jam Tangan Fossil Cokelat',
                'description' => 'Jam tangan Fossil dengan tali kulit cokelat hilang kemarin sore di pusat perbelanjaan. Jam ini sangat bermakna karena hadiah dari orang tua. Reward menanti untuk yang menemukan dan mengembalikan!',
                'location' => 'Kepri, Indonesia',
                'type' => 'lost',
                'category' => 'Accessories',
                'status' => 'active',
                'image_url' => null,
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
