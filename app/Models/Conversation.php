<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = [];

    /**
     * Participants dalam conversation ini.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    /**
     * Semua pesan dalam conversation ini.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Pesan terakhir dalam conversation (untuk preview di conversation list).
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Dapatkan participant lawan bicara (bukan user yang diberikan).
     */
    public function getOtherParticipant(int $userId): ?User
    {
        return $this->participants->firstWhere('id', '!=', $userId);
    }

    /**
     * Hitung jumlah pesan yang belum dibaca oleh user tertentu.
     */
    public function unreadCountFor(int $userId): int
    {
        $participant = $this->participants()->where('user_id', $userId)->first();

        if (! $participant) {
            return 0;
        }

        $lastReadAt = $participant->pivot->last_read_at;

        $query = $this->messages()->where('user_id', '!=', $userId);

        if ($lastReadAt) {
            $query->where('created_at', '>', $lastReadAt);
        }

        return $query->count();
    }

    /**
     * Cari atau buat conversation antara dua user.
     */
    public static function findOrCreateBetween(int $userIdA, int $userIdB): self
    {
        // Cari conversation yang memiliki tepat 2 participant ini
        $conversation = static::whereHas('participants', function ($q) use ($userIdA) {
            $q->where('user_id', $userIdA);
        })->whereHas('participants', function ($q) use ($userIdB) {
            $q->where('user_id', $userIdB);
        })->first();

        if ($conversation) {
            return $conversation;
        }

        // Buat conversation baru
        $conversation = static::create();
        $conversation->participants()->attach([$userIdA, $userIdB]);

        return $conversation;
    }
}
