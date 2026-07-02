import { Head, Link } from '@inertiajs/react';
import { Search, MapPin, Handshake, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Welcome() {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Welcome to KOKODA" />
            <div className="min-h-screen bg-background font-quicksand text-tertiary selection:bg-highlight selection:text-tertiary">
                {/* Navbar */}
                <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-base/90 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center">
                                <img src="/images/logo-kokoda.svg" alt="KOKODA Logo" className="h-10 w-auto" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm font-bold text-gray-text-field transition-colors hover:text-tertiary"
                                >
                                    {t('welcome.signIn')}
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="hidden sm:block rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-tertiary shadow-md transition-all hover:-translate-y-0.5 hover:bg-highlight hover:shadow-lg"
                                >
                                    {t('welcome.getStarted')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main>
                    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col lg:flex-row items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-12">
                        {/* Text Content */}
                        <div className="text-center lg:text-left flex-1 z-10">
                            <h1 className="text-5xl font-extrabold tracking-tight text-tertiary sm:text-6xl lg:text-7xl font-roboto">
                                {t('welcome.title')}<br />
                                <span className="relative inline-block mt-2">
                                    <span className="relative z-10">{t('welcome.subtitle')}</span>
                                    <div className="absolute -bottom-2 left-0 h-4 w-full bg-highlight -z-10 rounded-sm"></div>
                                </span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-text-field font-quicksand font-medium max-w-2xl mx-auto lg:mx-0">
                                {t('welcome.desc')}
                            </p>
                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                                <Link
                                    href={route('home')}
                                    className="group flex items-center gap-2 rounded-full bg-tertiary px-8 py-4 text-base font-bold text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:bg-tertiary/90"
                                >
                                    {t('welcome.explore')}
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-base font-bold leading-6 text-tertiary transition-colors hover:text-secondary flex items-center gap-2"
                                >
                                    {t('welcome.join')} <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-tertiary/20 aspect-[4/3]">
                                <img 
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                                    alt="Students studying together" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
                            </div>
                            
                            {/* Decorative Floating Card */}
                            <div className="absolute -bottom-8 -left-8 bg-base p-6 rounded-2xl shadow-xl shadow-tertiary/10 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="bg-label-found text-base p-3 rounded-full">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-tertiary">{t('welcome.walletFound')}</p>
                                    <p className="text-xs text-gray-text-field">{t('welcome.returnedToOwner')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-base py-24 sm:py-32 border-y border-primary/30">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-secondary tracking-widest uppercase">{t('welcome.fasterRecovery')}</h2>
                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                    {t('welcome.everythingYouNeed')}
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    {/* Feature 1 */}
                                    <div className="group flex flex-col rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50 transition-all hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-2">
                                        <img 
                                            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                            alt="Search concept" 
                                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-md"
                                        />
                                        <dt className="flex items-center gap-x-4 text-xl font-bold leading-7 text-tertiary font-roboto">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-tertiary">
                                                <Search className="h-6 w-6" />
                                            </div>
                                            {t('welcome.smartSearch')}
                                        </dt>
                                        <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-text-field">
                                            <p className="flex-auto">{t('welcome.smartSearchDesc')}</p>
                                        </dd>
                                    </div>
                                    {/* Feature 2 */}
                                    <div className="group flex flex-col rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50 transition-all hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-2">
                                        <img 
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                            alt="Map concept" 
                                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-md"
                                        />
                                        <dt className="flex items-center gap-x-4 text-xl font-bold leading-7 text-tertiary font-roboto">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-tertiary">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            {t('welcome.locationBased')}
                                        </dt>
                                        <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-text-field">
                                            <p className="flex-auto">{t('welcome.locationBasedDesc')}</p>
                                        </dd>
                                    </div>
                                    {/* Feature 3 */}
                                    <div className="group flex flex-col rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50 transition-all hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-2">
                                        <img 
                                            src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                            alt="Handshake concept" 
                                            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-md"
                                        />
                                        <dt className="flex items-center gap-x-4 text-xl font-bold leading-7 text-tertiary font-roboto">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-tertiary">
                                                <Handshake className="h-6 w-6" />
                                            </div>
                                            {t('welcome.secureClaiming')}
                                        </dt>
                                        <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-text-field">
                                            <p className="flex-auto">{t('welcome.secureClaimingDesc')}</p>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="relative isolate overflow-hidden bg-tertiary py-24 sm:py-32">
                        <img 
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
                            alt="University Campus" 
                            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" 
                        />
                        <div className="absolute inset-0 -z-10 bg-tertiary/60"></div>
                        
                        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                            <div className="mx-auto max-w-2xl lg:mx-0">
                                <h2 className="text-4xl font-extrabold tracking-tight text-base sm:text-5xl font-roboto">{t('welcome.trustedByCommunity')}</h2>
                                <p className="mt-6 text-lg leading-8 text-primary font-medium">
                                    {t('welcome.joinThousands')}
                                </p>
                            </div>
                            <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                                <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col-reverse gap-y-2">
                                        <dt className="text-base leading-7 text-background/80">{t('welcome.itemsReturned')}</dt>
                                        <dd className="text-4xl font-extrabold tracking-tight text-highlight font-roboto">10,000+</dd>
                                    </div>
                                    <div className="flex flex-col-reverse gap-y-2">
                                        <dt className="text-base leading-7 text-background/80">{t('welcome.activeUsers')}</dt>
                                        <dd className="text-4xl font-extrabold tracking-tight text-highlight font-roboto">5,000+</dd>
                                    </div>
                                    <div className="flex flex-col-reverse gap-y-2">
                                        <dt className="text-base leading-7 text-background/80">{t('welcome.campuses')}</dt>
                                        <dd className="text-4xl font-extrabold tracking-tight text-highlight font-roboto">12</dd>
                                    </div>
                                    <div className="flex flex-col-reverse gap-y-2">
                                        <dt className="text-base leading-7 text-background/80">{t('welcome.successRate')}</dt>
                                        <dd className="text-4xl font-extrabold tracking-tight text-highlight font-roboto">94%</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-background border-t border-primary/20">
                    <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <span className="text-sm font-bold leading-5 text-gray-text-field hover:text-secondary cursor-pointer transition-colors">{t('welcome.privacyPolicy')}</span>
                            <span className="text-sm font-bold leading-5 text-gray-text-field hover:text-secondary cursor-pointer transition-colors">{t('welcome.termsOfService')}</span>
                            <span className="text-sm font-bold leading-5 text-gray-text-field hover:text-secondary cursor-pointer transition-colors">{t('welcome.contactSupport')}</span>
                        </div>
                        <div className="mt-8 md:order-1 md:mt-0 flex items-center justify-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-tertiary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <p className="text-center text-sm font-bold leading-5 text-tertiary">
                                &copy; {new Date().getFullYear()} KOKODA {t('welcome.allRightsReserved')}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
