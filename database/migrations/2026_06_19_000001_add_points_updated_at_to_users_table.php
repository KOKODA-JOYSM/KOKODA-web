<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('points_updated_at')->nullable()->after('points');
        });

        // Backfill: set points_updated_at to updated_at for existing users who have points
        \DB::table('users')
            ->where('points', '>', 0)
            ->update(['points_updated_at' => \DB::raw('updated_at')]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('points_updated_at');
        });
    }
};
