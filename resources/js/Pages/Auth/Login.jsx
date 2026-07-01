import Checkbox from '@/Components/Auth/Checkbox';
import InputError from '@/Components/Auth/InputError';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/Components/Common/LanguageSwitcher';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const canRegister = typeof route === 'function' && route().has('register');

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-primary px-4 py-8 font-quicksand text-tertiary sm:px-6">
            <Head title="Log in" />

            <div className="absolute top-4 right-4 w-24">
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-base shadow-xl lg:grid lg:min-h-[440px] lg:grid-cols-[2fr_3fr]">
                <div className="relative hidden lg:block">
                    <img
                        src="/images/lost-and-found-image.png"
                        alt="Lost and found box"
                        className="h-full w-full object-cover object-[center_72%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tertiary/55 via-transparent to-transparent" />
                </div>

                <div className="flex items-center justify-center bg-base px-6 py-8 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-3 flex items-center gap-2 text-tertiary">
                                    <img src="/images/logo-kokoda-black.svg" alt="KOKODA logo" className="h-14 w-auto" />
                            </div>
                            <h1 className="text-[2.87rem] font-bold leading-tight text-secondary" style={{ textShadow: '3.2px 3.2px 0.8px rgba(0, 0, 0, 0.5)' }}>
                                Welcome Back!
                            </h1>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-lg border border-online-color/30 bg-online-color/10 px-3 py-2 text-sm font-semibold text-online-color">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <TextInput
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="Username / Email address"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2 text-label-lost" />
                            </div>

                            <div>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full rounded-lg border-secondary bg-base px-4 py-3 pr-12 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-text-field transition hover:text-tertiary"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 text-label-lost" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <label className="inline-flex items-center gap-2 text-sm font-medium text-tertiary">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-secondary text-secondary focus:ring-secondary"
                                    />
                                    Remember me for 30 days
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-gray-text-field underline underline-offset-2 transition hover:text-tertiary"
                                    >
                                        {t('auth.forgot')}
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full rounded-lg bg-secondary px-4 py-3 text-base font-bold uppercase tracking-wide text-background transition hover:bg-tertiary hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? '...' : t('auth.login')}
                            </button>
                        </form>

                        <div className="my-3 h-px w-full bg-secondary/50" />

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-lg border border-secondary/60 bg-base px-4 py-3 font-semibold text-gray-text-field shadow-sm transition hover:bg-background"
                        >
                            <span className="text-xl leading-none text-[#DB4437]">G</span>
                            Sign in with Google
                        </button>

                        {canRegister && (
                            <p className="mt-7 text-center text-base text-tertiary">
                                {t('auth.noAccount')}{' '}
                                <Link href={route('register')} className="font-semibold text-secondary underline underline-offset-2 hover:text-tertiary">
                                    {t('auth.register')}
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
