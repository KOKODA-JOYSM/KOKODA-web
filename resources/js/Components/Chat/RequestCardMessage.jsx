import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, PackageCheck, Clock, Loader2 } from 'lucide-react';
import { avatarUrl } from '@/Components/Common/Avatar';

const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop';

/** Avatar for the card sender (used on incoming/left-aligned cards). */
function getSenderAvatar(message) {
    if (message.senderAvatar) return message.senderAvatar;
    const url = avatarUrl(message.sender);
    if (url) return url;
    const name = message.senderName || message.sender?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4C799&color=311A05`;
}

/**
 * E-commerce-style request card shown inside a conversation.
 *
 * Two templates form a two-step handshake on a claim:
 *  - "verification": the item holder confirms the item is genuine  → claim accepted
 *  - "received":     the recipient confirms they got it back        → claim completed
 *
 * Actionability is ROLE-based (not authorship): the verification card is
 * actionable by the holder, the received card by the recipient. Both cards are
 * created together when either party follows up, so each side can act on theirs.
 */
export default function RequestCardMessage({ message, onRequestRating, authUserId }) {
    const meta = message.meta || {};
    const post = meta.post || {};
    const template = meta.template; // 'verification' | 'received'

    // Live status comes from the server (overlaid per-fetch); keep an optimistic
    // override after the viewer acts so the card updates without a refetch.
    const [acted, setActed] = useState(null);
    const status = acted || meta.claim_status || 'pending';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const imageUrl = post.image_url || FALLBACK_IMG;
    const isLost = post.type === 'lost';
    const isOwn = !!message.isOwn;

    const viewerIsHolder = authUserId != null && authUserId === meta.holder_id;
    const viewerIsRecipient = authUserId != null && authUserId === meta.recipient_id;

    const handleAction = async () => {
        setLoading(true);
        setError(null);
        const endpoint = template === 'verification' ? 'verify' : 'receive';
        try {
            const { data } = await window.axios.post(`/api/claims/${meta.claim_id}/${endpoint}`);
            const newStatus = data?.claim?.status || (template === 'verification' ? 'accepted' : 'completed');
            setActed(newStatus);

            // The recipient who just confirmed receipt rates the holder/finder.
            if (template === 'received') {
                onRequestRating?.(data.claim);
            }
        } catch (e) {
            setError(e.response?.data?.error || 'Something went wrong. Please try again.');
            const serverStatus = e.response?.data?.claim?.status;
            if (serverStatus) setActed(serverStatus);
        } finally {
            setLoading(false);
        }
    };

    // ── Resolve the button/info state for this template + status + viewer ──
    let actionable = false;
    let label;
    let Icon = CheckCircle;
    let tone = 'bg-secondary text-base'; // primary action color
    let done = false;

    if (template === 'verification') {
        if (status === 'pending') {
            Icon = ShieldCheck;
            if (viewerIsHolder) {
                actionable = true;
                label = 'Verify Item';
            } else {
                label = 'Waiting for verification';
                Icon = Clock;
                tone = 'bg-highlight text-tertiary';
            }
        } else {
            label = 'Item Verified';
            Icon = ShieldCheck;
            tone = 'bg-label-found text-base';
            done = true;
        }
    } else {
        // received
        if (status === 'completed') {
            label = 'Item Received';
            Icon = PackageCheck;
            tone = 'bg-label-found text-base';
            done = true;
        } else if (status === 'accepted') {
            Icon = PackageCheck;
            if (viewerIsRecipient) {
                actionable = true;
                label = 'Item Received';
            } else {
                label = 'Waiting for recipient';
                Icon = Clock;
                tone = 'bg-highlight text-tertiary';
            }
        } else {
            // pending — item not verified yet
            label = 'Waiting for verification';
            Icon = Clock;
            tone = 'bg-highlight text-tertiary';
        }
    }

    return (
        <div className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {!isOwn && (
                <div className="mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-base ring-2 ring-[#F7D8B0] md:h-9 md:w-9">
                    <img
                        src={getSenderAvatar(message)}
                        alt={message.senderName || 'User'}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
            <div className="w-[270px] max-w-[85%] overflow-hidden rounded-2xl border border-secondary/55 bg-base shadow-sm">
                {/* Image */}
                <div className="relative h-36 w-full bg-gray-200">
                    <img src={imageUrl} alt={post.title} className="h-full w-full object-cover" />
                    <span
                        className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-quicksand font-bold text-base ${
                            isLost ? 'bg-label-lost' : 'bg-label-found'
                        }`}
                    >
                        {isLost ? 'Lost Item' : 'Found Item'}
                    </span>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 p-3">
                    <p className="font-quicksand text-[11px] font-bold uppercase tracking-wide text-secondary">
                        {template === 'verification' ? 'Item Verification' : 'Item Handover'}
                    </p>
                    <h4 className="line-clamp-2 font-quicksand text-sm font-bold leading-tight text-tertiary">
                        {post.title || 'Item'}
                    </h4>

                    <p className="font-roboto text-[11px] leading-snug text-tertiary/70">
                        {template === 'verification'
                            ? 'Confirm this is the genuine owner’s item to start the handover.'
                            : 'Confirm once you have received your item back.'}
                    </p>

                    {error && (
                        <p className="rounded-md bg-red-50 px-2 py-1 text-[10px] text-red-500">{error}</p>
                    )}

                    {/* Action / status */}
                    {actionable ? (
                        <button
                            type="button"
                            onClick={handleAction}
                            disabled={loading}
                            className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl ${tone} py-2 font-quicksand text-xs font-bold shadow-sm transition-all hover:opacity-90 disabled:opacity-60`}
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                            {label}
                        </button>
                    ) : (
                        <div
                            className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl ${tone} py-2 font-quicksand text-xs font-bold opacity-90`}
                        >
                            {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                            {label}
                        </div>
                    )}

                    <span className="self-end text-[10px] text-tertiary/50">{message.timestamp}</span>
                </div>
            </div>
        </div>
    );
}
