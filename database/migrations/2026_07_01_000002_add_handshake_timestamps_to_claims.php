<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Two-way handshake tracking: the item holder verifies and the recipient
     * confirms receipt INDEPENDENTLY (either order). The claim only completes —
     * and the rating is only triggered — once BOTH timestamps are set.
     */
    public function up(): void
    {
        if (! Schema::hasTable('claims')) {
            return;
        }

        Schema::table('claims', function (Blueprint $table) {
            if (! Schema::hasColumn('claims', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('status');
            }
            if (! Schema::hasColumn('claims', 'received_at')) {
                $table->timestamp('received_at')->nullable()->after('verified_at');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('claims')) {
            return;
        }

        Schema::table('claims', function (Blueprint $table) {
            foreach (['verified_at', 'received_at'] as $column) {
                if (Schema::hasColumn('claims', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
