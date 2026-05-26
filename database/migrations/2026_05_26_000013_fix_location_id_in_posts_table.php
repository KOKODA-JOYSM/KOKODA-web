<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Comprehensive fix migration for the posts table to match new structure:
 *
 *  1. Drop `category` column (no longer needed)
 *  2. Drop old `location` text column
 *  3. Add `location_id` nullable FK column pointing to `locations` table
 *
 * This handles the real database state which evolved outside of migrations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // 1. Drop category column if it exists
            if (Schema::hasColumn('posts', 'category')) {
                $table->dropColumn('category');
            }

            // 2. Drop old text location column if it exists
            if (Schema::hasColumn('posts', 'location')) {
                $table->dropColumn('location');
            }

            // 3. Add location_id FK (nullable — existing posts have no location)
            if (!Schema::hasColumn('posts', 'location_id')) {
                $table->unsignedBigInteger('location_id')->nullable()->after('user_id');
                $table->foreign('location_id')
                      ->references('id')
                      ->on('locations')
                      ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Reverse: drop location_id FK
            if (Schema::hasColumn('posts', 'location_id')) {
                $table->dropForeign(['location_id']);
                $table->dropColumn('location_id');
            }

            // Re-add old columns
            if (!Schema::hasColumn('posts', 'category')) {
                $table->string('category')->nullable()->after('title');
            }
            if (!Schema::hasColumn('posts', 'location')) {
                $table->string('location')->nullable()->after('category');
            }
        });
    }
};
