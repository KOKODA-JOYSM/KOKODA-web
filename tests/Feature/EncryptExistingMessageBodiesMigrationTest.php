<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class EncryptExistingMessageBodiesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_migration_encrypts_legacy_plaintext_rows_and_leaves_already_encrypted_rows_alone(): void
    {
        $sender = User::factory()->create();
        $conversation = Conversation::create();
        $conversation->participants()->attach($sender->id);

        // Simulate a row written before the encrypted cast existed (raw insert bypasses the cast).
        $legacyId = DB::table('messages')->insertGetId([
            'conversation_id' => $conversation->id,
            'user_id' => $sender->id,
            'body' => 'Pesan lama sebelum enkripsi',
            'type' => 'text',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Simulate a row that has already been encrypted (e.g. migration ran once already).
        $alreadyEncryptedId = DB::table('messages')->insertGetId([
            'conversation_id' => $conversation->id,
            'user_id' => $sender->id,
            'body' => Crypt::encryptString('Pesan yang sudah terenkripsi'),
            'type' => 'text',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $migration = require database_path('migrations/2026_07_02_000001_encrypt_existing_message_bodies.php');
        $migration->up();

        $this->assertEquals('Pesan lama sebelum enkripsi', Message::find($legacyId)->body);
        $this->assertEquals('Pesan yang sudah terenkripsi', Message::find($alreadyEncryptedId)->body);

        $rawLegacyBody = DB::table('messages')->where('id', $legacyId)->value('body');
        $this->assertNotEquals('Pesan lama sebelum enkripsi', $rawLegacyBody);
    }
}
