<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tracks user online status by updating `last_seen_at` in the database.
 *
 * This middleware is the server-side heartbeat for online/offline tracking.
 * Azure production does not run a Reverb WebSocket server, so presence
 * channels never fire. Instead, every authenticated web request touches
 * `last_seen_at`. The Chat frontend polls `/chat/online-status` to read
 * which users have been active within the last 2 minutes.
 *
 * To avoid hammering the DB on every single request, updates are throttled
 * to once every 60 seconds per user via a lightweight session check.
 */
class UpdateLastSeen
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (Auth::check()) {
            $lastUpdated = $request->session()->get('last_seen_updated', 0);

            // Throttle: only touch DB once per 60 seconds
            if (time() - $lastUpdated >= 60) {
                DB::table('users')
                    ->where('id', Auth::id())
                    ->update(['last_seen_at' => now()]);

                $request->session()->put('last_seen_updated', time());
            }
        }

        return $response;
    }
}
