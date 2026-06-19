<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'location_id',
        'title',
        'description',
        'image_url',
        'type', // 'lost' atau 'found'
        'status', // 'active', 'resolved'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * All comments on this post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Always expose image_url as a full, publicly reachable URL.
     *
     * Single source of truth for image URLs across home, search, profile,
     * and the detail view. Works both locally and on Azure as long as
     * APP_URL is correct and `php artisan storage:link` has been run.
     * Storage operations (delete) must use getRawOriginal('image_url').
     */
    public function getImageUrlAttribute($value): ?string
    {
        if (! $value) {
            return null;
        }

        if (str_starts_with($value, 'http')) {
            return $value;
        }

        return asset('storage/'.$value);
    }
}
