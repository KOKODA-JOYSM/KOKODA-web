import { useState } from 'react';

const KEY = 'kokoda_seen_comment_counts';

/**
 * Tracks how many comments the user had already seen on each post, so we can
 * surface a "new comment" notification dot on a post the user owns and clear it
 * once they open the comments. Persisted in localStorage, keyed by post id.
 */
function load() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
        return {};
    }
}

export function useSeenComments() {
    const [seen, setSeen] = useState(load);

    const seenCount = (postId) => seen[postId] ?? 0;

    const markSeen = (postId, count) => {
        setSeen((prev) => {
            if ((prev[postId] ?? 0) >= count) return prev; // nothing new
            const next = { ...prev, [postId]: count };
            try {
                localStorage.setItem(KEY, JSON.stringify(next));
            } catch {}
            return next;
        });
    };

    return { seenCount, markSeen };
}
