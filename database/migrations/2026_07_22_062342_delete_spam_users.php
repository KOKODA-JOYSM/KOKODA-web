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
        $usernames = ['ivan-andrianus_B5Cd', 'browski_TjPc'];

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
