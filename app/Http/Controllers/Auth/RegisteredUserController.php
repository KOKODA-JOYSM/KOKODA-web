<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
            'name' => 'required|string|max:255|unique:users,username',
            'username' => 'nullable|string|max:255|unique:users',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $username = $validated['username'] ?? $validated['name'];
        $otp = config('app.debug') ? '1111' : (string) random_int(1000, 9999);

        // Create user with OTP for verification
        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // Send OTP via Resend email
        Mail::to($user->email)->send(new OtpEmail($otp, $user->email));

        $request->session()->put('pending_email', $user->email);

        return redirect()->route('register.otp');
    }

    public function showOtp(Request $request): Response|RedirectResponse
    {
        $email = $request->session()->get('pending_email');

        if (! $email) {
            return redirect()->route('register');
        }

        $user = User::where('email', $email)->first();

        if (! $user || ! $user->otp_code) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/RegisterOtp', [
            'expiresAt' => $user->otp_expires_at->timestamp,
            'email' => $email,
            'status' => session('status'),
            'otpPreview' => config('app.debug') ? $user->otp_code : null,
        ]);
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $email = $request->session()->get('pending_email');

        if (! $email) {
            return redirect()->route('register');
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('register');
        }

        $otp = config('app.debug') ? '1111' : (string) random_int(1000, 9999);

        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new OtpEmail($otp, $user->email));

        return redirect()->route('register.otp')->with('status', 'A new OTP has been sent to your email.');
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'otp' => ['required', 'digits:4'],
        ]);

        $email = $request->session()->get('pending_email');

        if (! $email) {
            return redirect()->route('register');
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('register');
        }

        if (! $user->otp_code) {
            return back()->withErrors(['otp' => 'Invalid request. Please register again.']);
        }

        if (now()->isAfter($user->otp_expires_at)) {
            return back()->withErrors(['otp' => 'OTP has expired. Please request a new code.']);
        }

        if ($validated['otp'] !== $user->otp_code) {
            return back()->withErrors(['otp' => 'Invalid OTP. Please try again.']);
        }

        // Clear OTP and mark email as verified
        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'email_verified_at' => now(),
        ]);

        event(new Registered($user));
        Auth::login($user);

        $request->session()->forget('pending_email');

        return redirect()->route('home');
    }
}
