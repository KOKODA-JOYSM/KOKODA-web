<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('home');
})->name('dashboard');

// ─────────────────────────────────────────────────────────────────
// RUTE PROFILE (SUDAH DIUPDATE)
// ─────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    // 1. Menampilkan halaman utama profil custom kamu (Pages/Profile/Profile.jsx)
    Route::get('/profile', function () {
        $posts = app(\App\Http\Controllers\PostController::class)->myPosts();
        return Inertia::render('Profile/Profile', [
            'posts' => $posts,
            'status' => session('status'),
        ]);
    })->name('profile');

    // 2. Menggeser form edit bawaan Breeze ke URL /profile/edit (Pages/Profile/Edit.jsx)
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    // POST digunakan agar PHP bisa parse multipart/form-data (file upload) dengan benar
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
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

// Protected routes for posts
Route::middleware('auth')->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Chat routes
    Route::get('/chat', fn() => Inertia::render('Chat/Chat'))->name('chat');
});

require __DIR__.'/auth.php';