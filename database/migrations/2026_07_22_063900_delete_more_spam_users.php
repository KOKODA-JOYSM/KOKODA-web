<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $usernames = ['mark-lumiere_HjTG', 'wilson_71xm'];

        foreach ($usernames as $username) {
            DB::table('users')->where('username', $username)->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
