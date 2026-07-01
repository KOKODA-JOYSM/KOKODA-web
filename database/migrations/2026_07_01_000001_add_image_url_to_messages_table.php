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
        if (Schema::hasTable('messages') && ! Schema::hasColumn('messages', 'image_url')) {
            Schema::table('messages', function (Blueprint $table) {
                // URL/path gambar yang di-upload di chat.
                // Null untuk pesan teks biasa.
                $table->string('image_url', 500)->nullable()->after('meta');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('messages') && Schema::hasColumn('messages', 'image_url')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropColumn('image_url');
            });
        }
    }
};
