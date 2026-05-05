import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// ─────────────────────────────────────────────
//  NAV ITEMS CONFIG
// ─────────────────────────────────────────────
const NAV_ITEMS = [
    { label: 'Home',        href: '/home',        icon: '/images/icon-home.svg'        },
    { label: 'Leaderboard', href: '/leaderboard',  icon: '/images/icon-leaderboard.svg' },
    { label: 'Search',      href: '/search',       icon: '/images/icon-search.svg'      },
    { label: 'Chat',        href: '/chat',         icon: '/images/icon-chat.svg'        },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function Navbar() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);

    const isActive  = (item) => url.startsWith(item.href);
    const openMenu  = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* ── HAMBURGER BUTTON (tablet & mobile only) ── */}
            <button
                className="lg:hidden fixed top-4 left-4 sm:top-5 sm:left-5 z-[10001] bg-primary hover:bg-secondary border-none rounded-xl w-10 h-10 sm:w-11 sm:h-11 cursor-pointer flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-0 transition-colors duration-200 ease-in"
                onClick={openMenu}
                aria-label="Open menu"
                aria-expanded={isOpen}
            >
                <span className="block w-5 sm:w-6 h-0.5 bg-base rounded-sm" />
                <span className="block w-5 sm:w-6 h-0.5 bg-base rounded-sm" />
                <span className="block w-5 sm:w-6 h-0.5 bg-base rounded-sm" />
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
                    w-64 sm:w-72 md:w-80 lg:w-[400px] xl:w-[403px]
                    h-screen lg:min-h-[900px]
                    pt-16 sm:pt-12 lg:pt-8
                    px-4 sm:px-5 md:px-6 lg:px-7
                    pb-6
                    fixed lg:sticky top-0 left-0 z-[10000]
                    transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    lg:transform-none lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* LOGO */}
                <div className="flex justify-center lg:justify-start items-center pt-10 sm:pt-8 lg:pt-0 mb-6 sm:mb-7">
                    <img
                        src="/images/LogoKokoda.svg"
                        alt="KOKODA Logo"
                        className="w-36 h-12 sm:w-44 sm:h-14 md:w-52 md:h-16 lg:w-[280px] lg:h-[95px] object-contain"
                    />
                </div>

                {/* DIVIDER */}
                <div className="w-full h-0.5 bg-secondary opacity-45 rounded-sm mb-6 sm:mb-7" />

                {/* NAV LINKS */}
                <nav className="w-full h-full flex flex-col">
                    <ul className="flex-1 list-none m-0 p-0 flex flex-col gap-1.5 sm:gap-2 w-full">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href} className="w-full">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 sm:gap-4
                                    py-2.5 px-3.5 sm:py-3 sm:px-4 lg:py-3.5 lg:px-5
                                    rounded-xl cursor-pointer no-underline text-[#FEFEFE] font-quicksand
                                    text-lg sm:text-xl lg:text-[23px] font-semibold border-2 transition-all duration-200 select-none w-full box-border hover:translate-x-1 group ${isActive(item) ? 'border-secondary' : 'border-transparent'}`}
                                    aria-current={isActive(item) ? 'page' : undefined}
                                    id={`nav-${item.label.toLowerCase()}`}
                                    onClick={closeMenu}
                                >
                                    <img
                                        src={item.icon}
                                        alt={`${item.label} icon`}
                                        className="brightness-0 invert w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain shrink-0 transition-transform duration-200 group-hover:scale-110"
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* PROFILE */}
                    <div className="pt-4 mt-auto">
                        <Link
                            href="#"
                            className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-3.5 lg:p-4 rounded-xl bg-secondary no-underline border-2 border-transparent transition-colors duration-200 cursor-pointer w-full box-border hover:border-base"
                            id="nav-profile"
                            aria-label="Go to profile (coming soon)"
                            onClick={closeMenu}
                        >
                            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full shrink-0 overflow-hidden">
                                <img
                                    src="/images/icon-profile-avatar.svg"
                                    alt="Profile avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                <p className="text-[#FEFEFE] font-quicksand text-sm sm:text-base lg:text-[16px] font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis">Joysm</p>
                                <p className="text-[#FEFEFE] font-quicksand text-xs sm:text-sm font-normal m-0 whitespace-nowrap overflow-hidden text-ellipsis opacity-75">@ findit.joysm@gmail.com</p>
                            </div>
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    );
}
