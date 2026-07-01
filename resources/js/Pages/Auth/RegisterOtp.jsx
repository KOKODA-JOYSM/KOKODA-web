import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterOtp({ expiresAt, email, status, otpPreview }) {
    const { t } = useTranslation();
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        otp: '',
    });

    useEffect(() => {
        const updateRemainingTime = () => {
            const remaining = Math.max(0, Math.floor(expiresAt - Date.now() / 1000));
            setSecondsLeft(remaining);
        };

        updateRemainingTime();
        const timer = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    const formattedTimer = useMemo(() => {
        const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const seconds = String(secondsLeft % 60).padStart(2, '0');

        return `${minutes}:${seconds}`;
    }, [secondsLeft]);

    const updateOtpValue = (nextDigits) => {
        setOtpDigits(nextDigits);
        setData('otp', nextDigits.join(''));
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        clearErrors('otp');
        const nextDigits = [...otpDigits];
        nextDigits[index] = value;
        updateOtpValue(nextDigits);

        if (value && index < nextDigits.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const submitVerify = (e) => {
        e.preventDefault();
        post(route('register.otp.verify'));
    };

    const resendOtp = (e) => {
        e.preventDefault();
        post(route('register.otp.resend'), {
            preserveScroll: true,
            onSuccess: () => {
                const resetDigits = ['', '', '', ''];
                updateOtpValue(resetDigits);
                inputRefs.current[0]?.focus();
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-8 font-quicksand text-tertiary sm:px-6">
            <Head title="OTP Verification" />

            <div className="w-full max-w-2xl rounded-xl bg-base px-7 py-8 shadow-lg sm:px-10">
                <h1 className="text-center text-[2.87rem] font-bold leading-tight text-secondary" style={{ textShadow: '3.2px 3.2px 0.8px rgba(0, 0, 0, 0.5)' }}>
                    {t('auth.otpVerification')}
                </h1>

                <p className="mx-auto mt-2 max-w-xl text-center text-lg text-secondary/90">
                    {t('auth.otpSentTo')} {email} {t('auth.otpCompleteVerification')}
                </p>

                {otpPreview && (
                    <p className="mx-auto mt-3 max-w-xl rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-2 text-center text-sm font-semibold text-secondary">
                        {t('auth.devOtpCode')}: {otpPreview}
                    </p>
                )}

                <form onSubmit={submitVerify} className="mt-6">
                    <div className="flex justify-center gap-5 sm:gap-7">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
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

                    {errors.otp && <p className="mt-3 text-center text-sm font-semibold text-label-lost">{errors.otp}</p>}

                    <p className="mt-5 text-center text-lg text-secondary/90">{t('auth.remainingTime')}: {formattedTimer}</p>

                    <div className="mt-2 text-center text-lg text-secondary/90">
                        {t('auth.didntGetCode')}{' '}
                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={processing}
                            className="font-medium underline underline-offset-2 transition hover:text-tertiary disabled:opacity-60"
                        >
                            {processing ? t('auth.resending') : t('auth.resend')}
                        </button>
                    </div>

                    {status && <p className="mt-3 text-center text-sm font-semibold text-online-color">{status}</p>}

                    <div className="mt-6 space-y-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="block w-full rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-semibold text-background transition hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? t('auth.verifying') : t('auth.verify')}
                        </button>

                        <Link
                            href={route('register')}
                            className="block w-full rounded-lg border border-secondary bg-base px-4 py-3 text-center text-2xl font-medium text-tertiary transition hover:bg-background"
                        >
                            {t('profile.cancel')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
