<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Allow a user to claim the same post again after it has been resolved and
     * reactivated. Previous (completed/rejected) claims and their ratings are
     * kept for history; a fresh request simply adds a new claim row.
     *
     * The unique (post_id, claimant_id) index also backs the post_id foreign
     * key, so we add a replacement composite index FIRST (separate statement),
     * then drop the unique.
     */
    public function up(): void
    {
        // Add the replacement non-unique index only if it doesn't already exist.
        // The unique index may serve as the backing index for the post_id FK, so
        // the non-unique index must exist BEFORE we drop the unique one.
        $existingIndexes = collect(\DB::select("SHOW INDEX FROM claims"))
            ->pluck('Key_name')
            ->unique();

        if (! $existingIndexes->contains('claims_post_claimant_index')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->index(['post_id', 'claimant_id'], 'claims_post_claimant_index');
            });
        }

        // Drop the unique constraint only if it still exists (Azure MySQL may
        // already have a different name or the migration may have partially run).
        if ($existingIndexes->contains('claims_post_id_claimant_id_unique')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->dropUnique('claims_post_id_claimant_id_unique');
            });
        }
    }

    public function down(): void
    {
        $existingIndexes = collect(\DB::select("SHOW INDEX FROM claims"))
            ->pluck('Key_name')
            ->unique();

        if (! $existingIndexes->contains('claims_post_id_claimant_id_unique')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->unique(['post_id', 'claimant_id'], 'claims_post_id_claimant_id_unique');
            });
        }

        if ($existingIndexes->contains('claims_post_claimant_index')) {
            Schema::table('claims', function (Blueprint $table) {
                $table->dropIndex('claims_post_claimant_index');
            });
        }
    }
};
