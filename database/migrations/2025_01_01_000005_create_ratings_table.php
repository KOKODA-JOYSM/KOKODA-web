<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            // UNIQUE: satu claim hanya menghasilkan satu rating (sesuai ERD ||--o|)
            $table->foreignId('claim_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('rater_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('ratee_id')->constrained('users')->cascadeOnDelete();
            $table->tinyInteger('score')->unsigned();  // 1–5
            $table->integer('point')->default(0);
            $table->text('review_text')->nullable();
            $table->timestamps();

            // Untuk kalkulasi avg rating per user
            $table->index('ratee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
