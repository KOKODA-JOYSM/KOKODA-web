import { useState } from 'react';

const KEY = 'kokoda_seen_claim_ids';

function load() {
    try {
        return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
        return new Set();
    }
}

export function useSeenClaims() {
    const [seenIds, setSeenIds] = useState(load);

    const markAllSeen = (ids) => {
        setSeenIds(prev => {
            const next = new Set([...prev, ...ids]);
            try {
                localStorage.setItem(KEY, JSON.stringify([...next]));
            } catch {}
            return next;
        });
    };

    return { seenIds, markAllSeen };
}
