import InputError from '@/Components/Auth/InputError';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register({ previousName = '', previousEmail = '' }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: previousName,
        email: previousEmail,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-8 font-quicksand text-tertiary sm:px-6">
            <Head title="Register" />

            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-base shadow-xl lg:grid lg:min-h-[440px] lg:grid-cols-[2fr_3fr]">
                <div className="relative hidden lg:block">
                    <img
                        src="/images/lost-and-found-image.png"
                        alt="Lost and found box"
                        className="h-full w-full object-cover object-[center_72%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tertiary/55 via-transparent to-transparent" />
                </div>

                <div className="flex items-center justify-center bg-base px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-9 flex flex-col items-center text-center">
                            <div className="mb-4 flex items-center gap-2 text-tertiary">
                                    <img src="/images/logo-kokoda-black.svg" alt="KOKODA logo" className="h-14 w-auto" />
                            </div>
                            <h1 className="text-[2.87rem] font-bold leading-tight text-secondary" style={{ textShadow: '3.2px 3.2px 0.8px rgba(0, 0, 0, 0.5)' }}>
                                Create Account
                            </h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Username"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-label-lost" />
                            </div>

                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                    autoComplete="username"
                                    placeholder="Email address"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                        autoComplete="new-password"
                                        placeholder="Password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
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

                            <div>
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="block w-full rounded-lg border-secondary bg-base px-4 py-3 pr-12 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                        autoComplete="new-password"
                                        placeholder="Confirm Password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-text-field transition hover:text-tertiary"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2 text-label-lost" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-3 w-full rounded-lg bg-secondary px-4 py-3 text-base font-bold uppercase tracking-wide text-background transition hover:bg-tertiary hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Signing up...' : 'Sign up'}
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

                        <p className="mt-7 text-center text-base text-tertiary">
                            Already have account?{' '}
                            <Link href={route('login')} className="font-semibold text-secondary underline underline-offset-2 hover:text-tertiary">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
