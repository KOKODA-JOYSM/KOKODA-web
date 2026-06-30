<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('messages') && ! Schema::hasColumn('messages', 'meta')) {
            Schema::table('messages', function (Blueprint $table) {
                // Structured payload for non-text messages (e.g. request cards).
                $table->json('meta')->nullable()->after('type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('messages') && Schema::hasColumn('messages', 'meta')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropColumn('meta');
            });
        }
    }
};
