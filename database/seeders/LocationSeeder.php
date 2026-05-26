<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = User::query()->pluck('id')->all();
        if (empty($userIds)) {
            return;
        }

        $locations = [
            ['place_name' => 'AEON Mall Sentul Gate A', 'latitude' => -6.5869500, 'longitude' => 106.8241500],
            ['place_name' => 'AEON Sentul Food Hall', 'latitude' => -6.5872200, 'longitude' => 106.8245200],
            ['place_name' => 'Alun Alun Bogor', 'latitude' => -6.5950000, 'longitude' => 106.7920000],
            ['place_name' => 'Kebun Raya Bogor', 'latitude' => -6.6008000, 'longitude' => 106.7990000],
            ['place_name' => 'Stasiun Bogor', 'latitude' => -6.5953000, 'longitude' => 106.7905000],
            ['place_name' => 'Summarecon Mall Bekasi', 'latitude' => -6.2463000, 'longitude' => 107.0017000],
            ['place_name' => 'Stasiun Bekasi', 'latitude' => -6.2356000, 'longitude' => 106.9994000],
            ['place_name' => 'Alun Alun Bandung', 'latitude' => -6.9217000, 'longitude' => 107.6043000],
            ['place_name' => 'Jalan Braga Bandung', 'latitude' => -6.9175000, 'longitude' => 107.6098000],
            ['place_name' => 'Stasiun Bandung', 'latitude' => -6.9176000, 'longitude' => 107.6020000],
            ['place_name' => 'Cihampelas Walk', 'latitude' => -6.8922000, 'longitude' => 107.6037000],
            ['place_name' => 'Trans Studio Bandung', 'latitude' => -6.9253000, 'longitude' => 107.6364000],
            ['place_name' => 'Alun Alun Cirebon', 'latitude' => -6.7219000, 'longitude' => 108.5606000],
            ['place_name' => 'Stasiun Cirebon Kejaksan', 'latitude' => -6.7071000, 'longitude' => 108.5574000],
            ['place_name' => 'Alun Alun Sukabumi', 'latitude' => -6.9197000, 'longitude' => 106.9274000],
            ['place_name' => 'Alun Alun Tasikmalaya', 'latitude' => -7.3279000, 'longitude' => 108.2207000],
            ['place_name' => 'Alun Alun Garut', 'latitude' => -7.2196000, 'longitude' => 107.9086000],
            ['place_name' => 'Situ Patenggang Ciwidey', 'latitude' => -7.1667000, 'longitude' => 107.3570000],
            ['place_name' => 'Waduk Jatiluhur', 'latitude' => -6.5567000, 'longitude' => 107.3913000],
            ['place_name' => 'Pantai Pangandaran', 'latitude' => -7.6877000, 'longitude' => 108.6475000],
        ];

        $now = now();
        $rows = [];
        $locationCount = count($locations);
        $userCount = count($userIds);

        foreach ($locations as $index => $location) {
            $userId = $userIds[$index % $userCount];
            $rows[] = [
                'user_id' => $userId,
                'place_name' => $location['place_name'],
                'latitude' => $location['latitude'],
                'longitude' => $location['longitude'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        Location::query()->upsert(
            $rows,
            ['user_id', 'place_name', 'latitude', 'longitude'],
            ['updated_at']
        );
    }
}
