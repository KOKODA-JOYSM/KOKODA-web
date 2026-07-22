<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Delete messages that were encrypted (they start with eyJ which is {"iv":... in base64)
        // so that they don't clutter the UI since the encryption key has changed.
        DB::table('messages')->where('body', 'LIKE', 'eyJ%')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
