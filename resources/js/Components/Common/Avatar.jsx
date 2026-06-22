import React from 'react';

/**
 * Avatar — renders a user's profile photo (profile_icon) consistently across
 * the app (posts, comments, etc).
 *
 * The DB stores profile_icon as a path relative to /public, e.g.
 * "images/profile-icons/abc.png". It is served from the web root, so we
 * prefix it with "/" exactly like the navbar does.
 *
 * When the user has no profile_icon — or the file fails to load — we fall back
 * to a generated ui-avatars image based on their name, so an avatar always
 * shows up instead of a blank circle.
 */

/** Build the avatar image URL for a user (or null if we can't). */
export function avatarUrl(user) {
    if (user?.profile_icon) {
        // Already an absolute URL (e.g. social login) — use as-is.
        if (/^https?:\/\//i.test(user.profile_icon)) return user.profile_icon;
        // Stored relative to /public — make sure there's exactly one leading slash.
        return '/' + String(user.profile_icon).replace(/^\/+/, '');
    }
    return null;
}

/** Generated fallback avatar from the user's name/username initials. */
function fallbackUrl(user) {
    const name = user?.name || user?.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4C799&color=311A05`;
}

export default function Avatar({ user, className = '', size = 36, alt }) {
    const src = avatarUrl(user) || fallbackUrl(user);

    return (
        <div
            className={`rounded-full overflow-hidden bg-highlight flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={src}
                alt={alt || user?.name || 'User avatar'}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    // If the stored file 404s, drop to the generated avatar once.
                    const fb = fallbackUrl(user);
                    if (e.target.src !== fb) e.target.src = fb;
                }}
            />
        </div>
    );
}
