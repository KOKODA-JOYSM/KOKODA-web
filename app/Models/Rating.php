<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = [
        'claim_id',
        'rater_id',
        'ratee_id',
        'score',
        'point',
        'review_text',
    ];

    public function ratee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ratee_id');
    }

    public function rater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claim::class);
    }

    protected static function booted(): void
    {
        static::saved(fn (Rating $rating) => $rating->ratee->recalculateStats());
        static::deleted(fn (Rating $rating) => $rating->ratee->recalculateStats());
    }
}
