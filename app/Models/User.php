<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        'points_updated_at',
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
            'points_updated_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Kirim link reset password lewat EmailJS (bukan SMTP Laravel).
     *
     * Seluruh email aplikasi ini dikirim via EmailJS REST API. Method bawaan
     * Laravel mengirim notifikasi via channel mail (SMTP), yang di server tidak
     * terkonfigurasi, sehingga di-override agar memakai EmailJS dengan template
     * khusus reset (EMAILJS_RESET_TEMPLATE_ID) dan variabel `link`.
     */
    public function sendPasswordResetNotification($token): void
    {
        $resetUrl = route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ]);

        try {
            $response = Http::post('https://api.emailjs.com/api/v1.0/email/send', [
                'service_id' => env('EMAILJS_SERVICE_ID'),
                'template_id' => env('EMAILJS_RESET_TEMPLATE_ID'),
                'user_id' => env('EMAILJS_PUBLIC_KEY'),
                'accessToken' => env('EMAILJS_PRIVATE_KEY'),
                'template_params' => [
                    'to_email' => $this->getEmailForPasswordReset(),
                    'link' => $resetUrl,
                ],
            ]);

            if (! $response->successful()) {
                Log::error('EmailJS password reset failed: '.$response->body());
            }
        } catch (\Exception $e) {
            Log::error('EmailJS password reset exception: '.$e->getMessage());
        }
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
                ->when($lastReadAt, fn ($col) => $col->where('created_at', '>', $lastReadAt))
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
        $newPoints = (int) $query->sum('point');

        $data = [
            'points' => $newPoints,
            'rating' => round((float) ($query->avg('score') ?? 0), 1),
        ];

        // Hanya update timestamp jika points berubah
        if ($this->points !== $newPoints) {
            $data['points_updated_at'] = now();
        }

        $this->update($data);
    }
}
