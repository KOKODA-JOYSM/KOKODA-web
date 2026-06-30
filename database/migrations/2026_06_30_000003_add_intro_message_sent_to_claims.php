<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tracks whether the claimant's request note (or a default intro) has
     * already been posted into the chat. It is sent once, the first time the
     * claimant follows up via a chat button, and never repeated.
     */
    public function up(): void
    {
        if (Schema::hasTable('claims') && ! Schema::hasColumn('claims', 'intro_message_sent')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->boolean('intro_message_sent')->default(false)->after('message');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('claims') && Schema::hasColumn('claims', 'intro_message_sent')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->dropColumn('intro_message_sent');
            });
        }
    }
};
