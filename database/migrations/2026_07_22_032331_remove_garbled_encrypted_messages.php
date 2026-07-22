<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all messages
        $messages = DB::table('messages')->where('body', 'LIKE', 'eyJ%')->get();

        foreach ($messages as $message) {
            try {
                \Illuminate\Support\Facades\Crypt::decryptString($message->body);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                // Only delete if it cannot be decrypted (meaning it's a legacy message with a broken key)
                DB::table('messages')->where('id', $message->id)->delete();
            }
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
