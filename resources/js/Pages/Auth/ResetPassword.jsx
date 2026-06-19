import InputError from '@/Components/Auth/InputError';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-primary px-4 pt-6 pb-8 font-quicksand text-tertiary sm:px-6 lg:flex lg:items-center lg:justify-center">
            <Head title="Reset Password" />

            <div className="w-full max-w-md rounded-2xl bg-base px-6 py-10 shadow-xl sm:px-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <img src="/images/logo-kokoda-black.svg" alt="KOKODA logo" className="mb-4 h-14 w-auto" />
                    <h1 className="text-[2.3rem] font-bold leading-tight text-secondary" style={{ textShadow: '3.2px 3.2px 0.8px rgba(0, 0, 0, 0.5)' }}>
                        Reset Password
                    </h1>
                    <p className="mt-2 text-center text-base text-secondary/90">
                        Choose a new password for your account.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                            autoComplete="username"
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2 text-label-lost" />
                    </div>

                    <div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                            autoComplete="new-password"
                            isFocused={true}
                            placeholder="New password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2 text-label-lost" />
                    </div>

                    <div>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2 text-label-lost" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 w-full rounded-lg bg-secondary px-4 py-3 text-base font-bold uppercase tracking-wide text-background transition hover:bg-tertiary hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="mt-7 text-center text-base text-tertiary">
                    Back to{' '}
                    <Link href={route('login')} className="font-semibold text-secondary underline underline-offset-2 hover:text-tertiary">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
