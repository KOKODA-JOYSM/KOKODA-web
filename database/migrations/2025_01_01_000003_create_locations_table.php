<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('place_name');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->timestamps();

            // Index untuk query Google Maps
            $table->index(['latitude', 'longitude']);
            $table->index(['user_id', 'place_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
