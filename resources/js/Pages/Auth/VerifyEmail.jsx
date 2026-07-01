import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function VerifyEmail({ status }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});
    const [otp, setOtp] = useState(['', '', '', '']);
    const [secondsLeft, setSecondsLeft] = useState(58);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return undefined;
        }

        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value;
        setOtp(nextOtp);

        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-8 font-quicksand text-tertiary sm:px-6">
            <Head title="OTP Verification" />

            <div className="w-full max-w-xl rounded-xl bg-base px-7 py-8 shadow-lg sm:px-9">
                <h1 className="text-center text-[3rem] font-bold leading-tight text-secondary" style={{ textShadow: '3.2px 3.2px 0.8px rgba(0, 0, 0, 0.5)' }}>
                    {t('auth.otpVerification')}
                </h1>

                <p className="mx-auto mt-2 max-w-lg text-center text-xl text-secondary/90">
                    {t('auth.otpEmailDesc')}
                </p>

                <div className="mt-6 flex justify-center gap-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="h-14 w-14 rounded-lg border border-secondary bg-base text-center text-2xl font-semibold text-tertiary focus:border-tertiary/50 focus:ring-tertiary/50"
                            aria-label={`${t('auth.otpDigit')} ${index + 1}`}
                        />
                    ))}
                </div>

                <p className="mt-5 text-center text-lg text-secondary/90">{t('auth.remainingTime')}: {minutes}:{seconds}</p>

                <form onSubmit={submit} className="mt-3 text-center text-lg text-secondary/90">
                    {t('auth.didntGetCode')}{' '}
                    <button
                        type="submit"
                        disabled={processing}
                        className="font-medium underline underline-offset-2 transition hover:text-tertiary disabled:opacity-60"
                    >
                        {processing ? t('auth.resending') : t('auth.resend')}
                    </button>
                </form>

                {status === 'verification-link-sent' && (
                    <p className="mt-3 text-center text-sm font-semibold text-online-color">
                        {t('auth.verificationLinkResent')}
                    </p>
                )}

                <div className="mt-6 space-y-3">
                    <Link
                        href={route('dashboard')}
                        className="block w-full rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-semibold text-background transition hover:bg-tertiary"
                    >
                        {t('auth.verify')}
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="block w-full rounded-lg border border-secondary bg-base px-4 py-3 text-center text-2xl font-medium text-tertiary transition hover:bg-background"
                    >
                        {t('profile.cancel')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
