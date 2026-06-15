<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->where('email', 'admin@gmail.com')
            ->update([
                'points' => 15,
                'rating' => 5.0,
            ]);
    }

    public function down(): void
    {
        DB::table('users')
            ->where('email', 'admin@gmail.com')
            ->update([
                'points' => 0,
                'rating' => 0.0,
            ]);
    }
};
