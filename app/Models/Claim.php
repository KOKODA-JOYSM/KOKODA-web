<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    protected $fillable = [
        'post_id',
        'claimant_id',
        'owner_id',
        'status',
        'message',
        'intro_message_sent',
    ];

    protected $casts = [
        'intro_message_sent' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The post being claimed.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * The user who submitted the claim.
     */
    public function claimant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'claimant_id');
    }

    /**
     * The post owner.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * The user who physically holds the item (the finder).
     *
     * For a "lost" post the poster lost it, so the claimant is the finder.
     * For a "found" post the poster found it, so the owner is the finder.
     * Requires the post relation to be loaded.
     */
    public function holderId(): int
    {
        return $this->post->type === 'lost' ? $this->claimant_id : $this->owner_id;
    }

    /**
     * The user who receives the item back (the original loser).
     */
    public function recipientId(): int
    {
        return $this->post->type === 'lost' ? $this->owner_id : $this->claimant_id;
    }

    /**
     * Which chat-card template a given user should see when following up.
     * The holder verifies the item; the recipient confirms receipt.
     */
    public function templateFor(int $userId): string
    {
        return $userId === $this->holderId() ? 'verification' : 'received';
    }
}
