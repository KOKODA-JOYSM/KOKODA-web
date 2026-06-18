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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
    public function create(Request $request): Response
    {
        $pending = $request->session()->get('pending_registration');

        return Inertia::render('Auth/Register', [
            'previousName' => $pending['name'] ?? '',
            'previousEmail' => $pending['email'] ?? '',
        ]);
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
        $otp = (string) random_int(1000, 9999);

        // Store user data in session until OTP is verified
        $pendingRegistration = [
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10)->timestamp,
        ];

        $request->session()->put('pending_registration', $pendingRegistration);

        // Send OTP via EmailJS
        $this->sendEmailJsOtp($validated['email'], $otp);

        return redirect()->route('register.otp');
    }

    public function showOtp(Request $request): Response|RedirectResponse
    {
        $pending = $request->session()->get('pending_registration');

        if (! $pending) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/RegisterOtp', [
            'expiresAt' => $pending['otp_expires_at'],
            'email' => $pending['email'],
            'status' => session('status'),
            'otpPreview' => null,
        ]);
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $pending = $request->session()->get('pending_registration');

        if (! $pending) {
            return redirect()->route('register');
        }

        $otp = (string) random_int(1000, 9999);

        $pending['otp_code'] = $otp;
        $pending['otp_expires_at'] = now()->addMinutes(10)->timestamp;

        $request->session()->put('pending_registration', $pending);

        $this->sendEmailJsOtp($pending['email'], $otp);

        return redirect()->route('register.otp')->with('status', 'A new OTP has been sent to your email.');
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'otp' => ['required', 'digits:4'],
        ]);

        $pending = $request->session()->get('pending_registration');

        if (! $pending) {
            return redirect()->route('register');
        }

        if (now()->timestamp > $pending['otp_expires_at']) {
            return back()->withErrors(['otp' => 'OTP has expired. Please request a new code.']);
        }

        if ($validated['otp'] !== $pending['otp_code']) {
            return back()->withErrors(['otp' => 'Invalid OTP. Please try again.']);
        }

        // Create the user permanently in the database now that OTP is valid
        $user = User::create([
            'name' => $pending['name'],
            'username' => $pending['username'],
            'email' => $pending['email'],
            'password' => $pending['password'],
            'email_verified_at' => now(),
        ]);

        event(new Registered($user));
        Auth::login($user);

        $request->session()->forget('pending_registration');

        return redirect()->route('home');
    }

    private function sendEmailJsOtp(string $email, string $otp): void
    {
        try {
            $response = Http::post('https://api.emailjs.com/api/v1.0/email/send', [
                'service_id' => env('EMAILJS_SERVICE_ID'),
                'template_id' => env('EMAILJS_TEMPLATE_ID'),
                'user_id' => env('EMAILJS_PUBLIC_KEY'),
                'accessToken' => env('EMAILJS_PRIVATE_KEY'),
                'template_params' => [
                    'to_email' => $email,
                    'passcode' => $otp,
                ]
            ]);

            if (!$response->successful()) {
                Log::error('EmailJS OTP Failed: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('EmailJS OTP Exception: ' . $e->getMessage());
        }
    }
}
