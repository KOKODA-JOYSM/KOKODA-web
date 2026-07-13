<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user already exists
            $user = User::where('google_id', $googleUser->id)->orWhere('email', $googleUser->email)->first();

            if ($user) {
                // Update google_id if it's missing (e.g., they previously signed up with email)
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                    ]);
                }
                
                Auth::login($user);
                return redirect()->intended(route('dashboard', absolute: false));
            } else {
                // Create a new user
                $newUser = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'username' => Str::slug($googleUser->name) . '_' . Str::random(4),
                    'google_id' => $googleUser->id,
                    'password' => null, // Password is not needed for Google login
                    'email_verified_at' => now(), // Assume Google verified their email
                ]);

                Auth::login($newUser);
                return redirect()->intended(route('dashboard', absolute: false));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google Login Error: ' . $e->getMessage());
            return redirect('/login')->withErrors(['email' => 'Terjadi kesalahan saat login dengan Google: ' . $e->getMessage()]);
        }
    }
}
