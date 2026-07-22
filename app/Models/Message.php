<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'user_id',
        'body',
        'type',
        'meta',
        'image_url',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /**
     * Gracefully decrypt the message body. If it fails (e.g. legacy plain text),
     * return the raw value instead of throwing a 500 error.
     */
    protected function body(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: function ($value) {
                if (empty($value)) return $value;
                try {
                    return \Illuminate\Support\Facades\Crypt::decryptString($value);
                } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                    return $value;
                }
            },
            set: fn ($value) => empty($value) ? $value : \Illuminate\Support\Facades\Crypt::encryptString($value),
        );
    }

    /**
     * Conversation tempat pesan ini berada.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * User yang mengirim pesan ini.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
