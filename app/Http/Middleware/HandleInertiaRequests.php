<?php

namespace App\Http\Middleware;

use App\Models\Claim;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'unreadConversationsCount' => fn () => $request->user()
                ? $request->user()->unreadConversationsCount()
                : 0,
            'pendingClaimsCount' => fn () => $request->user()
                ? Claim::where('owner_id', $request->user()->id)
                    ->where('status', 'pending')
                    ->count()
                : 0,
            'pendingClaimIds' => fn () => $request->user()
                ? Claim::where('owner_id', $request->user()->id)
                    ->where('status', 'pending')
                    ->pluck('id')
                    ->toArray()
                : [],
        ];
    }
}
