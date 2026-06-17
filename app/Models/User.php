<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Rating;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'profile_icon',
        'phone_number',
        'location',
        'points',
        'rating',
        'otp_code',
        'otp_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Conversations yang diikuti user ini.
     */
    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants')
            ->withPivot('last_read_at')
            ->withTimestamps();
    }

    /**
     * Semua pesan yang dikirim user ini.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Hitung total conversations dengan pesan yang belum dibaca.
     */
    public function unreadConversationsCount(): int
    {
        $count = 0;

        $conversations = $this->conversations()
            ->with(['messages' => function ($q) {
                $q->select('id', 'conversation_id', 'user_id', 'created_at');
            }])
            ->get();

        foreach ($conversations as $conversation) {
            $lastReadAt = $conversation->pivot->last_read_at;
            $unread = $conversation->messages
                ->where('user_id', '!=', $this->id)
                ->when($lastReadAt, fn($col) => $col->where('created_at', '>', $lastReadAt))
                ->count();

            if ($unread > 0) {
                $count++;
            }
        }

        return $count;
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'ratee_id');
    }

    public function recalculateStats(): void
    {
        $query = $this->ratings();
        $this->update([
            'points' => (int) $query->sum('point'),
            'rating' => round((float) ($query->avg('score') ?? 0), 1),
        ]);
    }
}
