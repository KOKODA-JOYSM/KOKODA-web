import InputError from '@/Components/Auth/InputError';
import TextInput from '@/Components/Auth/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPassword({ status }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-primary px-4 pt-6 pb-8 font-quicksand text-tertiary sm:px-6 lg:flex lg:items-center lg:justify-center">
            <Head title="Forgot Password" />

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
                                {t('auth.forgotPasswordTitle')}
                            </h1>
                            <p className="mt-2 text-center text-base text-secondary/90">
                                {t('auth.forgotPasswordDesc')}
                            </p>
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
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-lg border-secondary bg-base px-4 py-3 font-medium text-tertiary placeholder-gray-text-field focus:border-tertiary/50 focus:ring-tertiary/50"
                                    isFocused={true}
                                    autoComplete="username"
                                    placeholder={t('auth.emailAddressPlaceholder')}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2 text-label-lost" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-3 w-full rounded-lg bg-secondary px-4 py-3 text-base font-bold uppercase tracking-wide text-background transition hover:bg-tertiary hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? t('auth.sending') : t('auth.emailResetLink')}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-base text-tertiary">
                            {t('auth.backTo')}{' '}
                            <Link href={route('login')} className="font-semibold text-secondary underline underline-offset-2 hover:text-tertiary">
                                {t('auth.login')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
