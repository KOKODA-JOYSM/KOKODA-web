<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Register the /broadcasting/auth endpoint so that Laravel Echo can
// authenticate users for private & presence channels (online status).
// Without this route, presence-channel auth returns 404 on Azure and
// every user appears permanently offline.
Broadcast::routes(['middleware' => ['web', 'auth']]);

// Private channel untuk setiap conversation.
// User hanya bisa subscribe jika dia adalah participant conversation tersebut.
Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId) {
    return $user->conversations()->where('conversations.id', $conversationId)->exists();
});

// Private channel per user — untuk menerima update conversation list
// (new messages, conversation updated, dll).
Broadcast::channel('user.{userId}', function (User $user, int $userId) {
    return $user->id === $userId;
});

// Presence channel untuk online status.
// Semua authenticated user bisa join channel ini.
Broadcast::channel('chat.online', function (User $user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'username' => $user->username,
        'profile_icon' => $user->profile_icon,
    ];
});
