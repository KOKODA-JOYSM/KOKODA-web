<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MessageEncryptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_message_body_is_encrypted_at_rest(): void
    {
        $sender = User::factory()->create();
        $conversation = Conversation::create();
        $conversation->participants()->attach($sender->id);

        $plaintext = 'Halo, ini pesan rahasia.';

        $message = $conversation->messages()->create([
            'user_id' => $sender->id,
            'body' => $plaintext,
            'type' => 'text',
        ]);

        $rawBody = DB::table('messages')->where('id', $message->id)->value('body');

        $this->assertNotEquals($plaintext, $rawBody);

        $this->assertEquals($plaintext, Message::find($message->id)->body);
    }
}
