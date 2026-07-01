<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Azure App Service mengakhiri TLS di load balancer dan meneruskan
        // X-Forwarded-Proto/-For. Tanpa trust proxies, Laravel mengira request
        // adalah http sehingga redirect & form action auth memakai skema yang
        // salah (mixed-content / redirect gagal) di belakang proxy Azure.
        $middleware->trustProxies(at: '*');

        $middleware->redirectUsersTo('/home');

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
