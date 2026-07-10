import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSeenClaims } from '@/hooks/useSeenClaims';
import { useEcho } from '@/hooks/useEcho';

// ─────────────────────────────────────────────
//  NAV ITEMS (Translations will be handled inside component)
// ─────────────────────────────────────────────
const getNavItems = (t) => [
    { label: t('nav.home'),        href: '/home',        icon: '/images/icon-home.svg'        },
    { label: t('nav.leaderboard'), href: '/leaderboard', icon: '/images/icon-leaderboard.svg' },
    { label: t('nav.search'),      href: '/search',      icon: '/images/icon-search.svg'      },
    { label: t('nav.chat'),        href: '/chat',        icon: '/images/icon-chat.svg'        },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Navbar() {
    // Ambil URL dan props dengan aman
    const { url, props } = usePage();
    const user = props?.auth?.user || null;
    const pendingClaimIds = props?.pendingClaimIds || [];
    const updatedSentClaimIds = props?.updatedSentClaimIds || [];
    const unreadConversationsCount = props?.unreadConversationsCount || 0;

    const { seenIds } = useSeenClaims();
    // Incoming pending requests + sent requests that were resolved and now need a
    // rating. Sent ones use a "rate-" signature so they notify independently of a
    // plain claim id that may already have been marked seen while it was pending.
    const notifIds = [
        ...pendingClaimIds,
        ...updatedSentClaimIds.map(id => `rate-${id}`),
    ];
    const pendingClaimsCount = notifIds.filter(sig => !seenIds.has(sig)).length;

    const { t } = useTranslation();

    // Real-time: dengarkan channel privat user di SEMUA halaman. Saat ada
    // pesan/request baru (ConversationUpdated dibroadcast oleh ChatController
    // dan ClaimController), refresh shared props supaya badge chat di sidebar
    // dan bubble incoming request di profile langsung menyala tanpa reload.
    const { subscribeToUserChannel } = useEcho();
    useEffect(() => {
        if (!user?.id) return;
        subscribeToUserChannel(user.id, {
            onConversationUpdated: () => {
                // Di halaman profile ikut refresh incomingClaims/sentClaims agar
                // badge "Incoming Request" dan list-nya langsung ter-update.
                if (window.location.pathname.startsWith('/profile')) {
                    router.reload();
                    return;
                }
                router.reload({
                    only: [
                        'unreadConversationsCount',
                        'pendingClaimIds',
                        'updatedSentClaimIds',
                    ],
                });
            },
        });
    }, [user?.id, subscribeToUserChannel]);

    // Pastikan state isOpen ini ADA (ini yang bikin error tadi)
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive  = (item) => url?.startsWith(item.href);
    const hideHamburgerOnChat = url?.startsWith('/chat');
    const openMenu  = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);

    const btnPositionClass = hideHamburgerOnChat ? 'sm:top-[26px] sm:left-[18px]' : 'sm:top-5 sm:left-5';

    return (
        <>
            {/* ── HAMBURGER BUTTON (tablet & mobile only) ── */}
            <button
                id="hamburger-btn"
                className={`lg:hidden fixed top-4 left-4 ${btnPositionClass} z-[10001] bg-primary hover:bg-secondary border-none rounded-xl w-10 h-10 sm:w-11 sm:h-11 cursor-pointer flex flex-col items-center justify-center gap-1.5 p-0 transition-all duration-300 ease-in-out ${(hideHamburgerOnChat && !isOpen) ? 'opacity-0 -translate-x-full pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'}`}
                onClick={() => isOpen ? closeMenu() : openMenu()}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                <span className={`block w-5 sm:w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 sm:w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 sm:w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* ── BACKDROP (closes menu when clicked) ── */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/40 z-[9999] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* ── SIDEBAR ── */}
            <aside
                className={`flex flex-col flex-shrink-0 box-border bg-primary
                    w-64 sm:w-72 md:w-80 lg:w-72 xl:w-80 2xl:w-[340px]
                    h-screen
                    pt-4 sm:pt-5 lg:pt-6
                    px-4 sm:px-5 lg:px-5
                    pb-4 sm:pb-4 lg:pb-6
                    fixed lg:sticky top-0 left-0 z-[10000] lg:z-10
                    transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    lg:transform-none lg:translate-x-0
                    overflow-hidden
                    ${isOpen ? 'translate-x-0 z-[10000]' : '-translate-x-full'}`}
            >
                {/* LOGO */}
                <div className="flex justify-center lg:justify-start items-center pt-8 sm:pt-6 lg:pt-2 mb-4 sm:mb-5 flex-shrink-0">
                    <Link href="/home">
                        <img
                            src="/images/LogoKokoda.svg"
                            alt="KOKODA Logo"
                            className="brightness-0 w-32 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-16 xl:w-56 xl:h-[72px] object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                        />
                    </Link>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-0.5 bg-secondary opacity-45 rounded-sm mb-4 sm:mb-5 flex-shrink-0" />

                {/* NAV LINKS */}
                <nav className="w-full flex-1 overflow-y-auto no-scrollbar min-h-0">
                    <ul className="list-none m-0 pt-0 pb-0 pl-0 pr-1 flex flex-col gap-1 sm:gap-1.5 w-full">
                        {getNavItems(t).map((item) => {
                            // Chat requires authentication
                            const requiresAuth = item.label === 'Chat';
                            const needsLogin = requiresAuth && !user;

                            return (
                                <li key={item.href} className="w-full">
                                    <Link
                                        href={needsLogin ? '/login' : item.href}
                                        className={`flex items-center gap-3 sm:gap-3.5
                                        py-2 px-3 sm:py-2.5 sm:px-3.5 lg:py-3 lg:px-4
                                        rounded-xl cursor-pointer no-underline text-tertiary font-quicksand
                                        text-base sm:text-lg lg:text-xl font-semibold border-2 transition-all duration-200 select-none w-full box-border hover:translate-x-1 group ${isActive(item) ? 'border-secondary' : 'border-transparent'}`}
                                        aria-current={isActive(item) ? 'page' : undefined}
                                        onClick={closeMenu}
                                    >
                                        <img
                                            src={item.icon}
                                            alt={`${item.label} icon`}
                                            className="brightness-0 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 object-contain shrink-0 transition-transform duration-200 group-hover:scale-110"
                                        />
                                        <div className="flex items-center justify-between flex-1">
                                            <span>{item.label}</span>
                                            {item.label === 'Chat' && unreadConversationsCount > 0 && (
                                                <span 
                                                    className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-label-lost text-white text-[11px] font-quicksand font-bold shadow-md"
                                                    style={{ animation: 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                                >
                                                    {unreadConversationsCount > 99 ? '99+' : unreadConversationsCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* PROFILE LINK & DROPDOWN */}
                <div className="flex-shrink-0 pt-3 mt-auto relative" ref={profileDropdownRef}>
                    <div
                        className={`relative flex items-center justify-between p-2.5 sm:p-3 lg:p-3.5 rounded-xl bg-secondary border-2 transition-all duration-200 w-full box-border ${
                            url?.startsWith('/profile') || isProfileDropdownOpen ? 'border-base shadow-sm' : 'border-transparent hover:border-base/70'
                        }`}
                    >
                        <Link
                            href={user ? '/profile' : '/login'}
                            className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 cursor-pointer no-underline"
                            id="nav-profile"
                            aria-label={user ? 'Go to profile' : 'Log in'}
                            onClick={closeMenu}
                        >
                            {/* Notification bubble for pending requests */}
                            {user && pendingClaimsCount > 0 && (
                                <span
                                    className="absolute -top-1.5 -left-1.5 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-label-lost text-white text-[11px] font-quicksand font-bold shadow-md border-2 border-primary z-10"
                                    style={{ animation: 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                >
                                    {pendingClaimsCount > 99 ? '99+' : pendingClaimsCount}
                                </span>
                            )}
                            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full shrink-0 overflow-hidden bg-background shadow-inner border border-base/20">
                                <img
                                    src={
                                        user?.profile_icon
                                            ? '/' + user.profile_icon
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F4C799&color=311A05`
                                    }
                                    alt="Profile avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
                                {user ? (
                                    <>
                                        <p className="text-tertiary font-quicksand text-sm lg:text-[15px] font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.name}
                                        </p>
                                        <p className="text-tertiary font-quicksand text-xs font-medium m-0 whitespace-nowrap overflow-hidden text-ellipsis opacity-70">
                                            @ {user.email}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-tertiary font-quicksand text-sm lg:text-[15px] font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {t('nav.login')}
                                    </p>
                                )}
                            </div>
                        </Link>
                        
                        {user && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); }}
                                className={`ml-2 p-1.5 sm:p-2 rounded-lg text-tertiary transition-all duration-200 ${isProfileDropdownOpen ? 'bg-base/20 text-tertiary' : 'hover:bg-primary/50 text-tertiary/70'}`}
                                aria-label="Toggle profile menu"
                            >
                                <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    {/* Modern Dropdown for Logout */}
                    {user && (
                        <div 
                            className={`absolute bottom-[calc(100%+8px)] left-0 w-full bg-transparent overflow-hidden transition-all duration-300 origin-bottom ease-[cubic-bezier(0.34,1.56,0.64,1)] z-[11000] ${
                                isProfileDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-2'
                            }`}
                        >
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full px-4 py-3 bg-label-lost hover:bg-red-500 text-base rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-200 cursor-pointer"
                                onClick={() => { setIsProfileDropdownOpen(false); closeMenu(); }}
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                </svg>
                                <span>{t('profile.logout')}</span>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Notification bubble animation */}
            <style>{`
                @keyframes bubblePop {
                    0%   { transform: scale(0); }
                    70%  { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </>
    );
}