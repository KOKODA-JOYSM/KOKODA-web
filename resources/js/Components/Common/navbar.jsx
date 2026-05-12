import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// ─────────────────────────────────────────────
//  NAV ITEMS 
// ─────────────────────────────────────────────
const NAV_ITEMS = [
    { label: 'Home',        href: '/home',        icon: '/images/icon-home.svg'        },
    { label: 'Leaderboard', href: '/leaderboard', icon: '/images/icon-leaderboard.svg' },
    { label: 'Search',      href: '/search',      icon: '/images/icon-search.svg'      },
    { label: 'Chat',        href: '/chat',        icon: '/images/icon-chat.svg'        },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Navbar() {
    // Ambil URL dan props dengan aman
    const { url, props } = usePage();
    const user = props?.auth?.user || null;

    // Pastikan state isOpen ini ADA (ini yang bikin error tadi)
    const [isOpen, setIsOpen] = useState(false);

    const isActive  = (item) => url?.startsWith(item.href);
    const openMenu  = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* ── HAMBURGER BUTTON (tablet & mobile only) ── */}
            <button
                className="lg:hidden fixed top-4 left-4 sm:top-5 sm:left-5 z-[10001] bg-primary hover:bg-secondary border-none rounded-xl w-10 h-10 sm:w-11 sm:h-11 cursor-pointer flex flex-col items-center justify-center gap-1.5 p-0 transition-colors duration-200 ease-in"
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
                    pb-4 sm:pb-4 lg:pb-16
                    fixed lg:sticky top-0 left-0 z-[10000] lg:z-10
                    transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    lg:transform-none lg:translate-x-0
                    overflow-hidden
                    ${isOpen ? 'translate-x-0 z-[10000]' : '-translate-x-full'}`}
            >
                {/* LOGO */}
                <div className="flex justify-center lg:justify-start items-center pt-8 sm:pt-6 lg:pt-2 mb-4 sm:mb-5 flex-shrink-0">
                    <img
                        src="/images/LogoKokoda.svg"
                        alt="KOKODA Logo"
                        className="w-32 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-16 xl:w-56 xl:h-[72px] object-contain"
                    />
                </div>

                {/* DIVIDER */}
                <div className="w-full h-0.5 bg-secondary opacity-45 rounded-sm mb-4 sm:mb-5 flex-shrink-0" />

                {/* NAV LINKS */}
                <nav className="w-full flex-1 overflow-y-auto no-scrollbar min-h-0">
                    <ul className="list-none m-0 p-0 flex flex-col gap-1 sm:gap-1.5 w-full">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href} className="w-full">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 sm:gap-3.5
                                    py-2 px-3 sm:py-2.5 sm:px-3.5 lg:py-3 lg:px-4
                                    rounded-xl cursor-pointer no-underline text-[#FEFEFE] font-quicksand
                                    text-base sm:text-lg lg:text-xl font-semibold border-2 transition-all duration-200 select-none w-full box-border hover:translate-x-1 group ${isActive(item) ? 'border-secondary' : 'border-transparent'}`}
                                    aria-current={isActive(item) ? 'page' : undefined}
                                    onClick={closeMenu}
                                >
                                    <img
                                        src={item.icon}
                                        alt={`${item.label} icon`}
                                        className="brightness-0 invert w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 object-contain shrink-0 transition-transform duration-200 group-hover:scale-110"
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* PROFILE LINK (Bisa diklik & Data Dinamis) */}
                <div className="flex-shrink-0 pt-3">
                    <Link
                        href="/profile"
                        className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 lg:p-3.5 rounded-xl bg-secondary no-underline border-2 transition-colors duration-200 cursor-pointer w-full box-border hover:border-base ${
                            url?.startsWith('/profile') ? 'border-base' : 'border-transparent'
                        }`}
                        id="nav-profile"
                        aria-label="Go to profile"
                        onClick={closeMenu}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full shrink-0 overflow-hidden bg-background">
                            <img
                                src="/images/icon-profile-avatar.svg"
                                alt="Profile avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
                            <p className="text-base font-quicksand text-sm lg:text-[15px] font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                                {user?.name || 'Joysm'}
                            </p>
                            <p className="text-base font-quicksand text-xs font-normal m-0 whitespace-nowrap overflow-hidden text-ellipsis opacity-75">
                                @ {user?.email || 'findit.joysm@gmail.com'}
                            </p>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
}