<?php

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('messages')->orderBy('id')->chunkById(200, function ($messages) {
            foreach ($messages as $message) {
                try {
                    Crypt::decryptString($message->body);

                    continue; // Already encrypted.
                } catch (DecryptException) {
                    // Plaintext, needs encrypting below.
                }

                DB::table('messages')
                    ->where('id', $message->id)
                    ->update(['body' => Crypt::encryptString($message->body)]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('messages')->orderBy('id')->chunkById(200, function ($messages) {
            foreach ($messages as $message) {
                try {
                    $decrypted = Crypt::decryptString($message->body);
                } catch (DecryptException) {
                    continue; // Already plaintext.
                }

                DB::table('messages')
                    ->where('id', $message->id)
                    ->update(['body' => $decrypted]);
            }
        });
    }
};
