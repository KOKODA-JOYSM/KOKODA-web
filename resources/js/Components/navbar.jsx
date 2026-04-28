import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import tailwindConfig from '../../../tailwind.config.js';

// ─────────────────────────────────────────────
//  DESIGN TOKENS — langsung dari tailwind.config.js
// ─────────────────────────────────────────────
const { colors, fontFamily } = tailwindConfig.theme.extend;

const COLOR_PRIMARY   = colors.primary;    // '#F4C799'
const COLOR_SECONDARY = colors.secondary;  // '#C0976C'
const COLOR_BASE      = colors.base;       // '#FEFEFE'

const FONT_NAV        = fontFamily.quicksand.join(', ');
const FONT_NAV_SIZE   = '23px';
const FONT_NAV_WEIGHT = '600';

// ─────────────────────────────────────────────
//  CSS (injected into <head>)
// ─────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

  /* ══════════════════════════════════════
     HAMBURGER BUTTON (hidden on desktop)
  ══════════════════════════════════════ */
  .hamburger-btn {
    display: none;
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 10001;
    background-color: ${COLOR_PRIMARY};
    border: none;
    border-radius: 10px;
    width: 44px;
    height: 44px;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0;
    transition: background-color 0.2s ease;
  }

  .hamburger-btn:hover { background-color: ${COLOR_SECONDARY}; }

  .hamburger-btn span {
    display: block;
    width: 22px;
    height: 2.5px;
    background-color: ${COLOR_BASE};
    border-radius: 2px;
  }

  @media (max-width: 1023px) {
    .hamburger-btn { display: flex; }
  }

  /* ══════════════════════════════════════
     BACKDROP (mobile/tablet only)
  ══════════════════════════════════════ */
  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  .sidebar-backdrop.visible {
    opacity: 1;
    pointer-events: all;
  }

  @media (max-width: 1023px) {
    .sidebar-backdrop { display: block; }
  }

  /* ══════════════════════════════════════
     SIDEBAR WRAPPER
  ══════════════════════════════════════ */
  .kokoda-sidebar {
    background-color: ${COLOR_PRIMARY};
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  /* Desktop — always visible, full size */
  @media (min-width: 1024px) {
    .kokoda-sidebar {
      width: 403px;
      min-height: 910px;
      height: 100vh;
      padding: 32px 28px 24px 28px;
      position: relative;
      transform: none !important;
    }
  }

  /* Mobile & Tablet — slide-in overlay from left */
  @media (max-width: 1023px) {
    .kokoda-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: clamp(220px, 50vw, 360px);
      padding: 28px 16px 24px 16px;
      z-index: 10000;
      transform: translateX(-100%);
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .kokoda-sidebar.open {
      transform: translateX(0);
    }
  }

  /* ══════════════════════════════════════
     LOGO
  ══════════════════════════════════════ */
  .sidebar-logo-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 28px;
  }
  .sidebar-logo {
    width: 284px;
    height: 95px;
    object-fit: contain;
  }

  @media (max-width: 1023px) {
    .sidebar-logo { width: 140px; height: 48px; }
    .sidebar-logo-wrapper {
      justify-content: center;
      padding-top: 44px;
      margin-top: 0;
    }
  }

  /* ══════════════════════════════════════
     DIVIDER
  ══════════════════════════════════════ */
  .sidebar-divider {
    width: 100%;
    height: 1.5px;
    background-color: ${COLOR_SECONDARY};
    opacity: 0.45;
    border-radius: 2px;
    margin-bottom: 28px;
  }

  /* ══════════════════════════════════════
     NAV LIST
  ══════════════════════════════════════ */
  .sidebar-nav-list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  /* ══════════════════════════════════════
     NAV LINK
  ══════════════════════════════════════ */
  .sidebar-nav-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 13px 18px;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    color: ${COLOR_BASE};
    font-family: ${FONT_NAV};
    font-size: ${FONT_NAV_SIZE};
    font-weight: ${FONT_NAV_WEIGHT};
    border: 2px solid transparent;
    transition: border-color 0.22s ease, transform 0.18s ease;
    user-select: none;
    width: 100%;
    box-sizing: border-box;
  }

  .sidebar-nav-link:hover { transform: translateX(4px); }

  .sidebar-nav-link.active { border-color: ${COLOR_SECONDARY}; }

  @media (max-width: 1023px) {
    .sidebar-nav-link { font-size: 20px; padding: 11px 14px; }
  }

  /* ══════════════════════════════════════
     ICON
  ══════════════════════════════════════ */
  .sidebar-nav-link img.nav-icon {
    filter: brightness(0) invert(1);
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .sidebar-nav-link:hover img.nav-icon { transform: scale(1.15); }

  /* ══════════════════════════════════════
     PROFILE LINK
  ══════════════════════════════════════ */
  .sidebar-profile-wrapper {
    padding-top: 16px;
  }

  .sidebar-profile-link {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 12px;
    background-color: ${COLOR_SECONDARY};
    text-decoration: none;
    border: 2px solid transparent;
    transition: border-color 0.22s ease;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }

  .sidebar-profile-link:hover { border-color: ${COLOR_BASE}; }

  .profile-avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .profile-name {
    color: ${COLOR_BASE};
    font-family: ${FONT_NAV};
    font-size: 16px;
    font-weight: ${FONT_NAV_WEIGHT};
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile-email {
    color: ${COLOR_BASE};
    font-family: ${FONT_NAV};
    font-size: 12px;
    font-weight: 400;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.75;
  }

  /* ══════════════════════════════════════
     PAGE CONTENT (push right of sidebar on desktop)
  ══════════════════════════════════════ */
  @media (max-width: 1023px) {
    .kokoda-page-content {
      padding-top: 72px; /* ruang untuk hamburger button */
    }
  }
`;

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
            <style>{STYLES}</style>

            {/* ── HAMBURGER BUTTON (tablet & mobile only) ── */}
            <button
                className="hamburger-btn"
                onClick={openMenu}
                aria-label="Open menu"
                aria-expanded={isOpen}
            >
                <span />
                <span />
                <span />
            </button>

            {/* ── BACKDROP (closes menu when clicked) ── */}
            <div
                className={`sidebar-backdrop${isOpen ? ' visible' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* ── SIDEBAR ── */}
            <aside className={`kokoda-sidebar${isOpen ? ' open' : ''}`}>

                {/* LOGO */}
                <div className="sidebar-logo-wrapper">
                    <img
                        src="/images/LogoKokoda.svg"
                        alt="KOKODA Logo"
                        className="sidebar-logo"
                    />
                </div>

                {/* DIVIDER */}
                <div className="sidebar-divider" />

                {/* NAV LINKS */}
                <nav style={{ width: '100%' }}>
                    <ul className="sidebar-nav-list">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href} style={{ width: '100%' }}>
                                <Link
                                    href={item.href}
                                    className={`sidebar-nav-link${isActive(item) ? ' active' : ''}`}
                                    aria-current={isActive(item) ? 'page' : undefined}
                                    id={`nav-${item.label.toLowerCase()}`}
                                    onClick={closeMenu}
                                >
                                    <img
                                        src={item.icon}
                                        alt={`${item.label} icon`}
                                        className="nav-icon"
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* PROFILE */}
                <div className="sidebar-profile-wrapper" style={{ marginTop: 'auto' }}>
                    <Link
                        href="#"
                        className="sidebar-profile-link"
                        id="nav-profile"
                        aria-label="Go to profile (coming soon)"
                        onClick={closeMenu}
                    >
                        <div className="profile-avatar">
                            <img
                                src="/images/icon-profile-avatar.svg"
                                alt="Profile avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="profile-info">
                            <p className="profile-name">Joysm</p>
                            <p className="profile-email">@ findit.joysm@gmail.com</p>
                        </div>
                    </Link>
                </div>

            </aside>
        </>
    );
}
