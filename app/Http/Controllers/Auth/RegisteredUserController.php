<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $username = $validated['username'] ?? $validated['name'];

        $request->session()->put('pending_registration', [
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'otp_code' => config('app.debug') ? '1111' : (string) random_int(1000, 9999),
            'otp_expires_at' => now()->addMinutes(1)->timestamp,
        ]);

        return redirect()->route('register.otp');
    }

    public function showOtp(Request $request): Response|RedirectResponse
    {
        $pendingRegistration = $request->session()->get('pending_registration');

        if (! $pendingRegistration) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/RegisterOtp', [
            'expiresAt' => $pendingRegistration['otp_expires_at'],
            'email' => $pendingRegistration['email'],
            'status' => session('status'),
            'otpPreview' => config('app.debug') ? $pendingRegistration['otp_code'] : null,
        ]);
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $pendingRegistration = $request->session()->get('pending_registration');

        if (! $pendingRegistration) {
            return redirect()->route('register');
        }

        $pendingRegistration['otp_code'] = config('app.debug') ? '1111' : (string) random_int(1000, 9999);
        $pendingRegistration['otp_expires_at'] = now()->addMinutes(1)->timestamp;
        $request->session()->put('pending_registration', $pendingRegistration);

        return redirect()->route('register.otp')->with('status', 'A new OTP has been sent.');
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'otp' => ['required', 'digits:4'],
        ]);

        $pendingRegistration = $request->session()->get('pending_registration');

        if (! $pendingRegistration) {
            return redirect()->route('register');
        }

        if (now()->timestamp > $pendingRegistration['otp_expires_at']) {
            return back()->withErrors(['otp' => 'OTP has expired. Please request a new code.']);
        }

        if ($validated['otp'] !== $pendingRegistration['otp_code']) {
            return back()->withErrors(['otp' => 'Invalid OTP. Please try again.']);
        }

        if (User::where('email', $pendingRegistration['email'])->exists()) {
            return back()->withErrors(['otp' => 'This email is already registered.']);
        }

        if (User::where('username', $pendingRegistration['username'])->exists()) {
            return back()->withErrors(['otp' => 'This username is already taken.']);
        }

        $user = User::create([
            'name' => $pendingRegistration['name'],
            'username' => $pendingRegistration['username'],
            'email' => $pendingRegistration['email'],
            'password' => $pendingRegistration['password'],
        ]);

        event(new Registered($user));
        Auth::login($user);

        $request->session()->forget('pending_registration');

        return redirect()->route('home');
    }
}
