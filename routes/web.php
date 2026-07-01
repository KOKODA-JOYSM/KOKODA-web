<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Empty endpoint ("/") -> Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return redirect()->route('home');
})->name('dashboard');

// ─────────────────────────────────────────────────────────────────
// RUTE PROFILE (SUDAH DIUPDATE)
// ─────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    // 1. Menampilkan halaman utama profil custom kamu (Pages/Profile/Profile.jsx)
    Route::get('/profile', function () {
        $user = auth()->user();
        $posts = app(PostController::class)->myPosts();

        // Hanya klaim yang masih menunggu keputusan ditampilkan di Incoming Request.
        // Setelah diresolve (completed) atau ditolak (rejected), klaim tidak lagi
        // muncul di sini — post yang resolved akan muncul di tab History.
        // Show requests that are still in flight (pending or mid-handshake
        // 'accepted'). Once 'completed'/'rejected' (or the post is resolved)
        // they drop off here and move to History.
        $incomingClaims = \App\Models\Claim::where('owner_id', $user->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->whereHas('post', fn ($q) => $q->where('status', 'active'))
            ->with(['post', 'post.location', 'claimant'])
            ->orderByDesc('created_at')
            ->get();

        $sentClaims = \App\Models\Claim::where('claimant_id', $user->id)
            ->with(['post', 'post.location', 'post.user', 'owner'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Profile/Profile', [
            'posts'          => $posts,
            'incomingClaims' => $incomingClaims,
            'sentClaims'     => $sentClaims,
            'status'         => session('status'),
        ]);
    })->name('profile');

    // 2. Menggeser form edit bawaan Breeze ke URL /profile/edit (Pages/Profile/Edit.jsx)
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 3. Public profile – bisa diakses siapa saja (tidak perlu login)
Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
// ─────────────────────────────────────────────────────────────────

Route::get('/search', function () {
    return Inertia::render('Search');
})->name('search');

Route::get('/leaderboard', [LeaderboardController::class, 'show'])->name('leaderboard');
Route::get('/api/leaderboard', [LeaderboardController::class, 'index']);

// API routes for search
Route::get('/api/locations', [PostController::class, 'getLocations']);
Route::get('/api/search', [PostController::class, 'search']);

// Public routes for posts
Route::get('/home', [PostController::class, 'index'])->name('home');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Public route — anyone can read comments
Route::get('/api/posts/{post}/comments', [CommentController::class, 'index'])->name('comments.index');

// Protected routes for posts
Route::middleware('auth')->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // ─────────────────────────────────────────────────────────────
    // COMMENT ROUTES
    // ─────────────────────────────────────────────────────────────
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('/posts/{post}/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // ─────────────────────────────────────────────────────────────
    // CLAIM / REQUEST ROUTES
    // ─────────────────────────────────────────────────────────────
    Route::post('/posts/{post}/claim', [ClaimController::class, 'store'])->name('claims.store');
    Route::get('/api/posts/{post}/claim-status', [ClaimController::class, 'getUserClaim'])->name('claims.status');
    Route::patch('/api/claims/{claim}/resolve', [ClaimController::class, 'resolve'])->name('claims.resolve');
    Route::patch('/api/claims/{claim}/reject', [ClaimController::class, 'reject'])->name('claims.reject');
    Route::post('/api/claims/{claim}/follow-up', [ClaimController::class, 'followUp'])->name('claims.followup');
    Route::post('/api/claims/{claim}/verify', [ClaimController::class, 'verify'])->name('claims.verify');
    Route::post('/api/claims/{claim}/receive', [ClaimController::class, 'receive'])->name('claims.receive');

    // ─────────────────────────────────────────────────────────────
    // RATING ROUTES
    // ─────────────────────────────────────────────────────────────
    Route::post('/api/ratings', [RatingController::class, 'store'])->name('ratings.store');

    // ─────────────────────────────────────────────────────────────
    // CHAT ROUTES
    // ─────────────────────────────────────────────────────────────
    Route::get('/chat', [ChatController::class, 'index'])->name('chat');
    Route::get('/chat/conversations', [ChatController::class, 'conversations'])->name('chat.conversations');
    Route::post('/chat/conversations', [ChatController::class, 'startConversation'])->name('chat.start');
    Route::get('/chat/conversations/{conversation}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::post('/chat/conversations/{conversation}/messages', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::post('/chat/conversations/{conversation}/image', [ChatController::class, 'sendImage'])->name('chat.send.image');
    Route::post('/chat/conversations/{conversation}/read', [ChatController::class, 'markAsRead'])->name('chat.read');
    Route::post('/chat/conversations/{conversation}/typing', [ChatController::class, 'typing'])->name('chat.typing');
    Route::get('/chat/users/search', [ChatController::class, 'searchUsers'])->name('chat.users.search');
});

require __DIR__.'/auth.php';

// Endpoint yang tidak dikenal / kosong diarahkan kembali ke home.
Route::fallback(function () {
    return redirect()->route('home');
});

// Language Switch Route
Route::get('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'id'])) {
        session()->put('locale', $locale);
    }
    return back();
})->name('lang.switch');
