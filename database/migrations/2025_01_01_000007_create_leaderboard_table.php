<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaderboard', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('leaderboard_version')->default(1);
            $table->integer('total_points')->default(0);
            $table->timestamps();

            // Satu user hanya muncul sekali per versi leaderboard
            $table->unique(['user_id', 'leaderboard_version']);

            // Untuk sorting ranking
            $table->index(['leaderboard_version', 'total_points']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaderboard');
    }
};
