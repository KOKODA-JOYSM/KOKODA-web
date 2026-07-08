import { Head, Link } from '@inertiajs/react';
import { Search, MapPin, Handshake, ChevronRight, CheckCircle2, Sparkles, Quote, ClipboardList, Bell, ShieldCheck, Zap, Users, Lock, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectionGlow } from '@/hooks/useSectionGlow';
import { DotPattern } from '@/Components/magicui/dot-pattern';
import { AnimatedGradientText } from '@/Components/magicui/animated-gradient-text';
import { BorderBeam } from '@/Components/magicui/border-beam';
import { ShimmerButton } from '@/Components/magicui/shimmer-button';
import { NumberTicker } from '@/Components/magicui/number-ticker';
import { MagicCard } from '@/Components/magicui/magic-card';
import { Marquee } from '@/Components/magicui/marquee';
import { FadeIn } from '@/Components/magicui/fade-in';
import { MouseGlow } from '@/Components/magicui/mouse-glow';
import { StaggerGroup, StaggerItem } from '@/Components/magicui/stagger';
import { Tilt3DCard } from '@/Components/magicui/tilt-3d-card';
import { ScrollParallaxImg } from '@/Components/magicui/scroll-parallax-img';

const MotionLink = motion.create(Link);

export default function Welcome() {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);

    const heroGlow = useSectionGlow();
    const featuresGlow = useSectionGlow();
    const howItWorksGlow = useSectionGlow();
    const whyUsGlow = useSectionGlow();
    const statsGlow = useSectionGlow();
    const reunionsGlow = useSectionGlow();
    const testimonialsGlow = useSectionGlow();

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
                                <MotionLink
                                    href={route('home')}
                                    whileHover={{ y: -3, backgroundColor: '#FFE7A3', boxShadow: '0 10px 20px -6px rgba(49,26,5,0.25)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="hidden sm:block rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-tertiary shadow-md"
                                >
                                    {t('welcome.getStarted')}
                                </MotionLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main>
                    <div
                        ref={heroGlow.ref}
                        onMouseMove={heroGlow.onMouseMove}
                        className="group relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col lg:flex-row items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-12"
                    >
                        <MouseGlow color="244,199,153" />
                        <DotPattern
                            width={24}
                            height={24}
                            cr={1.5}
                            className="-z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_60%,transparent_100%)]"
                        />

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left flex-1 z-10"
                        >

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
                                <ShimmerButton as={Link} href={route('home')} shimmerColor="#FFE7A3" background="#311A05">
                                    {t('welcome.explore')}
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </ShimmerButton>
                                <Link
                                    href={route('register')}
                                    className="text-base font-bold leading-6 text-tertiary transition-colors hover:text-secondary flex items-center gap-2"
                                >
                                    {t('welcome.join')} <span>&rarr;</span>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-tertiary/20 aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                                    alt="Students studying together"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
                                <BorderBeam size={180} duration={7} colorFrom="#FFE7A3" colorTo="#311A05" />
                            </div>

                            {/* Decorative Floating Card */}
                            <motion.div
                                className="absolute -bottom-8 -left-8 bg-base p-6 rounded-2xl shadow-xl shadow-tertiary/10 flex items-center gap-4"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className="bg-label-found text-base p-3 rounded-full">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-tertiary">{t('welcome.walletFound')}</p>
                                    <p className="text-xs text-gray-text-field">{t('welcome.returnedToOwner')}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Features Section */}
                    <div
                        ref={featuresGlow.ref}
                        onMouseMove={featuresGlow.onMouseMove}
                        className="group relative bg-base py-24 sm:py-32 border-y border-primary/30"
                    >
                        <MouseGlow color="192,151,108" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-secondary tracking-widest uppercase">{t('welcome.fasterRecovery')}</h2>
                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                    {t('welcome.everythingYouNeed')}
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <StaggerGroup as="dl" className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    {[
                                        {
                                            Icon: Search,
                                            img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                            alt: 'Search concept',
                                            title: t('welcome.smartSearch'),
                                            desc: t('welcome.smartSearchDesc'),
                                        },
                                        {
                                            Icon: MapPin,
                                            img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                            alt: 'Map concept',
                                            title: t('welcome.locationBased'),
                                            desc: t('welcome.locationBasedDesc'),
                                        },
                                        {
                                            Icon: Handshake,
                                            img: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                            alt: 'Handshake concept',
                                            title: t('welcome.secureClaiming'),
                                            desc: t('welcome.secureClaimingDesc'),
                                        },
                                    ].map(({ Icon, img, alt, title, desc }) => (
                                        <StaggerItem key={title}>
                                            <MagicCard className="flex h-full flex-col rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50">
                                                <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-6 shadow-md">
                                                    <img src={img} alt={alt} className="h-full w-full object-cover" />
                                                </div>
                                                <dt className="flex items-center gap-x-4 text-xl font-bold leading-7 text-tertiary font-roboto">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-tertiary">
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    {title}
                                                </dt>
                                                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-text-field">
                                                    <p className="flex-auto">{desc}</p>
                                                </dd>
                                            </MagicCard>
                                        </StaggerItem>
                                    ))}
                                </StaggerGroup>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div
                        ref={howItWorksGlow.ref}
                        onMouseMove={howItWorksGlow.onMouseMove}
                        className="group relative overflow-hidden bg-background py-24 sm:py-32"
                    >
                        <MouseGlow color="255,231,163" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-secondary tracking-widest uppercase">{t('welcome.simpleProcess')}</h2>
                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                    {t('welcome.howItWorksHeading')}
                                </p>
                                <p className="mt-4 text-lg leading-8 text-gray-text-field font-quicksand font-medium">
                                    {t('welcome.howItWorksSubheading')}
                                </p>
                            </div>
                            <StaggerGroup className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-20 lg:max-w-none lg:grid-cols-3">
                                {[
                                    { Icon: ClipboardList, title: t('welcome.step1Title'), desc: t('welcome.step1Desc') },
                                    { Icon: Bell, title: t('welcome.step2Title'), desc: t('welcome.step2Desc') },
                                    { Icon: ShieldCheck, title: t('welcome.step3Title'), desc: t('welcome.step3Desc') },
                                ].map(({ Icon, title, desc }, i) => (
                                    <StaggerItem key={title} className="relative text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary text-highlight shadow-lg">
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <span className="mt-4 block text-sm font-bold text-secondary tracking-widest">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="mt-2 text-xl font-bold text-tertiary font-roboto">{title}</h3>
                                        <p className="mt-3 text-base leading-7 text-gray-text-field">{desc}</p>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </div>
                    </div>

                    {/* Why Us Section — 3D tilt showcase */}
                    <div
                        ref={whyUsGlow.ref}
                        onMouseMove={whyUsGlow.onMouseMove}
                        className="group relative overflow-hidden bg-base py-24 sm:py-32 border-y border-primary/30"
                    >
                        <MouseGlow color="93,140,173" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-secondary tracking-widest uppercase">{t('welcome.whyUsEyebrow')}</h2>
                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                    {t('welcome.whyUsHeading')}
                                </p>
                                <p className="mt-4 text-lg leading-8 text-gray-text-field font-quicksand font-medium">
                                    {t('welcome.whyUsSubheading')}
                                </p>
                            </div>
                            <StaggerGroup className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
                                {[
                                    { Icon: Zap, title: t('welcome.whyUs1Title'), desc: t('welcome.whyUs1Desc') },
                                    { Icon: Users, title: t('welcome.whyUs2Title'), desc: t('welcome.whyUs2Desc') },
                                    { Icon: Lock, title: t('welcome.whyUs3Title'), desc: t('welcome.whyUs3Desc') },
                                    { Icon: Award, title: t('welcome.whyUs4Title'), desc: t('welcome.whyUs4Desc') },
                                ].map(({ Icon, title, desc }) => (
                                    <StaggerItem key={title}>
                                        <Tilt3DCard className="h-full rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary text-highlight shadow-md">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="mt-5 text-lg font-bold text-tertiary font-roboto">{title}</h3>
                                            <p className="mt-3 text-sm leading-6 text-gray-text-field">{desc}</p>
                                        </Tilt3DCard>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </div>
                    </div>

                    {/* Platform Impact Section */}
                    <div
                        ref={statsGlow.ref}
                        onMouseMove={statsGlow.onMouseMove}
                        className="group relative isolate overflow-hidden bg-tertiary py-24 sm:py-32"
                    >
                        <ScrollParallaxImg
                            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
                            alt="University Campus"
                            range={[-60, 60]}
                            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 -z-10 bg-tertiary/80 backdrop-blur-sm"></div>
                        <MouseGlow color="255,231,163" size={550} />

                        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-highlight tracking-widest uppercase">Platform Impact</h2>
                                <p className="mt-2 text-4xl font-extrabold tracking-tight text-base sm:text-5xl font-roboto">
                                    Our Impact in Numbers
                                </p>
                                <p className="mt-4 text-lg leading-8 text-primary font-medium">
                                    See how KOKODA is making a difference in the campus community every day.
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
                                <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                    {/* Stat 1 */}
                                    <div className="flex flex-col items-center justify-center gap-y-4 p-8 rounded-3xl bg-background/5 border border-primary/20 backdrop-blur-md">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="8" />
                                                <motion.circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-highlight"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                                                    whileInView={{ strokeDashoffset: 0 }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    viewport={{ once: true }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-extrabold text-highlight"><NumberTicker value={1250} suffix="+" /></span>
                                            </div>
                                        </div>
                                        <dt className="text-base font-medium leading-7 text-background/80 text-center">Items Successfully Returned</dt>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="flex flex-col items-center justify-center gap-y-4 p-8 rounded-3xl bg-background/5 border border-primary/20 backdrop-blur-md">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="8" />
                                                <motion.circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-highlight"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                                                    whileInView={{ strokeDashoffset: "70" }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    viewport={{ once: true }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-extrabold text-highlight">&lt; 24h</span>
                                            </div>
                                        </div>
                                        <dt className="text-base font-medium leading-7 text-background/80 text-center">Average Response Time</dt>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="flex flex-col items-center justify-center gap-y-4 p-8 rounded-3xl bg-background/5 border border-primary/20 backdrop-blur-md">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="8" />
                                                <motion.circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-highlight"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                                                    whileInView={{ strokeDashoffset: "17" }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    viewport={{ once: true }}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-extrabold text-highlight"><NumberTicker value={94} suffix="%" /></span>
                                            </div>
                                        </div>
                                        <dt className="text-base font-medium leading-7 text-background/80 text-center">User Satisfaction Rate</dt>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Featured Reunions Section */}
                    <div
                        ref={reunionsGlow.ref}
                        onMouseMove={reunionsGlow.onMouseMove}
                        className="group relative overflow-hidden bg-background py-24 sm:py-32"
                    >
                        <MouseGlow color="244,199,153" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-base font-bold leading-7 text-secondary tracking-widest uppercase">Success Stories</h2>
                                <p className="mt-2 text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                    Items Reunited with Their Owners
                                </p>
                                <p className="mt-4 text-lg leading-8 text-gray-text-field font-quicksand font-medium">
                                    Real stories making a difference on our campus.
                                </p>
                            </div>
                            
                            <StaggerGroup className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:max-w-none lg:grid-cols-3">
                                {[
                                    {
                                        img: "/images/id_card.jpg",
                                        title: "Student ID Card",
                                        location: "Building C Hallway",
                                        time: "Claimed in 15 mins",
                                        desc: "A lifesaver! I wouldn't have been able to take my midterms without it."
                                    },
                                    {
                                        img: "/images/shoes.jpg",
                                        title: "Running Shoes",
                                        location: "Sports Center",
                                        time: "Claimed in 45 mins",
                                        desc: "Left them near the bleachers after practice. Someone found them and reported immediately."
                                    },
                                    {
                                        img: "/images/tumbler.jpg",
                                        title: "Water Tumbler",
                                        location: "Library 2nd Floor",
                                        time: "Claimed in 2 hours",
                                        desc: "Left it on the desk while getting coffee. So glad it was turned in!"
                                    }
                                ].map((story, i) => (
                                    <StaggerItem key={i}>
                                        <MagicCard className="flex h-full flex-col rounded-3xl bg-background p-8 shadow-sm ring-1 ring-primary/50">
                                            <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-6 shadow-md">
                                                <img src={story.img} alt={story.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                                                <div className="absolute top-4 right-4 bg-label-returned text-base text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Returned
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-tertiary font-roboto">{story.title}</h3>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-text-field">
                                                <MapPin className="w-4 h-4 text-secondary" />
                                                <span>{story.location}</span>
                                            </div>
                                            <p className="mt-4 text-sm leading-6 text-gray-text-field flex-grow">"{story.desc}"</p>
                                            <div className="mt-6 pt-6 border-t border-primary/10 flex items-center justify-between">
                                                <span className="text-xs font-bold text-secondary uppercase tracking-wider">{story.time}</span>
                                            </div>
                                        </MagicCard>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                            
                            <div className="mt-16 flex justify-center">
                                <Link
                                    href={route('home')}
                                    className="text-sm font-bold leading-6 text-tertiary transition-colors hover:text-secondary flex items-center gap-2"
                                >
                                    See more success stories <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials Section */}
                    <div
                        ref={testimonialsGlow.ref}
                        onMouseMove={testimonialsGlow.onMouseMove}
                        className="group relative bg-base py-24 sm:py-32 overflow-hidden"
                    >
                        <MouseGlow color="93,140,173" />
                        <div className="relative mx-auto max-w-2xl text-center px-6">
                            <h2 className="text-3xl font-extrabold tracking-tight text-tertiary sm:text-4xl font-roboto">
                                {t('welcome.testimonialsHeading')}
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-gray-text-field font-quicksand font-medium">
                                {t('welcome.testimonialsSubheading')}
                            </p>
                        </div>
                        <FadeIn delay={0.1} className="relative mt-16 space-y-6">
                            <Marquee pauseOnHover className="[--duration:35s]">
                                {[1, 2, 3, 4].map((i) => (
                                    <TestimonialCard key={i} t={t} i={i} />
                                ))}
                            </Marquee>
                            <Marquee reverse pauseOnHover className="[--duration:38s]">
                                {[5, 6, 7, 8].map((i) => (
                                    <TestimonialCard key={i} t={t} i={i} />
                                ))}
                            </Marquee>
                        </FadeIn>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-base border-t border-primary/20">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Brand */}
                            <div className="col-span-2 lg:col-span-2">
                                <img src="/images/logo-kokoda.svg" alt="KOKODA Logo" className="h-9 w-auto" />
                                <p className="mt-4 max-w-xs text-sm font-medium leading-6 text-gray-text-field">
                                    {t('welcome.footerTagline')}
                                </p>
                            </div>

                            {/* Platform links */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-tertiary">{t('welcome.footerPlatform')}</h3>
                                <ul className="mt-4 space-y-3">
                                    <li>
                                        <Link href={route('home')} className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary">
                                            {t('welcome.explore')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('leaderboard')} className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary">
                                            {t('nav.leaderboard')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('posts.create')} className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary">
                                            {t('welcome.footerPostItem')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('login')} className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary">
                                            {t('welcome.signIn')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Support links */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-tertiary">{t('welcome.footerSupport')}</h3>
                                <ul className="mt-4 space-y-3">
                                    <li>
                                        <span className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary cursor-pointer">{t('welcome.contactSupport')}</span>
                                    </li>
                                    <li>
                                        <span className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary cursor-pointer">{t('welcome.privacyPolicy')}</span>
                                    </li>
                                    <li>
                                        <span className="text-sm font-bold leading-5 text-gray-text-field transition-colors hover:text-secondary cursor-pointer">{t('welcome.termsOfService')}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Get in touch / CTA */}
                            <div className="col-span-2 lg:col-span-1">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-tertiary">{t('welcome.footerGetInTouch')}</h3>
                                <p className="mt-4 text-sm font-medium leading-6 text-gray-text-field">
                                    {t('welcome.footerGetInTouchDesc')}
                                </p>
                                <Link
                                    href={route('register')}
                                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold leading-5 text-tertiary transition-colors hover:text-secondary"
                                >
                                    {t('welcome.getStarted')} <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-6 border-t border-primary/20 pt-8 md:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-tertiary">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <p className="text-center text-sm font-bold leading-5 text-tertiary">
                                    &copy; {new Date().getFullYear()} KOKODA {t('welcome.allRightsReserved')}
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function TestimonialCard({ t, i }) {
    return (
        <figure className="marquee-item relative w-80 shrink-0 rounded-2xl bg-background p-6 ring-1 ring-primary/40 shadow-sm">
            <Quote className="h-6 w-6 text-secondary/50" />
            <blockquote className="mt-3 text-sm leading-6 text-tertiary">
                {t(`welcome.testimonial${i}Quote`)}
            </blockquote>
            <figcaption className="mt-4 text-sm font-bold text-tertiary">
                {t(`welcome.testimonial${i}Name`)}
                <span className="ml-2 font-medium text-gray-text-field">{t(`welcome.testimonial${i}Role`)}</span>
            </figcaption>
        </figure>
    );
}
