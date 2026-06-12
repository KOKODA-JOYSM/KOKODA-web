<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->after('name');
            }
        });

        // CONCAT() tidak ada di SQLite (dipakai test suite & CI); SQLite memakai
        // operator ||, sedangkan MySQL (Azure) memakai CONCAT().
        $username = DB::getDriverName() === 'sqlite'
            ? "'user' || id"
            : "CONCAT('user', id)";

        DB::statement("UPDATE users SET username = {$username} WHERE username = '' OR username IS NULL");

        Schema::table('users', function (Blueprint $table) {
            $table->unique('username');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};
