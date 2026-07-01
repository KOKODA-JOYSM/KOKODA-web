import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, PackageCheck, Clock, Loader2, Star, Lock } from 'lucide-react';
import { avatarUrl } from '@/Components/Common/Avatar';
import { useTranslation } from '@/hooks/useTranslation';

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
 * A TWO-WAY handshake — each side presses independently, in any order:
 *  - "verification": the item holder confirms the item is genuine
 *  - "received":     the recipient confirms they got it back
 *
 * The claim only completes (and the post resolves) once BOTH have confirmed;
 * the rating is then given by the recipient to the holder/finder — for lost AND
 * found alike. Each press first asks for a confirmation reminder. Actionability
 * is ROLE-based (not authorship): the holder acts on the verification card, the
 * recipient on the received card; the other party sees it as a status.
 */
export default function RequestCardMessage({ message, onRequestRating, authUserId }) {
    const { t } = useTranslation();
    const meta = message.meta || {};
    const post = meta.post || {};
    const template = meta.template; // 'verification' | 'received'

    // Optimistic override after the viewer acts, plus the live handshake flags
    // overlaid by the server on each fetch.
    const [acted, setActed] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const status = meta.claim_status || 'pending';
    const rated = !!meta.rated;

    const imageUrl = post.image_url || FALLBACK_IMG;
    const isLost = post.type === 'lost';
    const isOwn = !!message.isOwn;

    const viewerIsHolder = authUserId != null && authUserId === meta.holder_id;
    const viewerIsRecipient = authUserId != null && authUserId === meta.recipient_id;

    // Each side's confirmation is independent; the claim only completes once BOTH
    // are set. `acted` optimistically reflects the viewer's own just-made press.
    const isVerified = (acted && template === 'verification') || meta.verified || status === 'completed';
    const isReceived = (acted && template === 'received') || meta.received || status === 'completed';
    const completed = status === 'completed';

    // Run the actual verify/receive call once the reminder has been accepted.
    const runAction = async () => {
        setConfirming(false);
        setLoading(true);
        setError(null);
        const endpoint = template === 'verification' ? 'verify' : 'receive';
        try {
            const { data } = await window.axios.post(`/api/claims/${meta.claim_id}/${endpoint}`);
            setActed(true);

            // Rating is triggered ONLY when this press completes the two-way
            // handshake — the server includes a `ratee` only when both sides have
            // now confirmed. Otherwise it waits for the other side.
            if (template === 'received' && data?.claim?.ratee) {
                onRequestRating?.(data.claim);
            }
        } catch (e) {
            setError(e.response?.data?.error || t('chat.somethingWentWrong'));
        } finally {
            setLoading(false);
        }
    };

    // Open the rating modal for a completed handshake (recipient rates the finder).
    const openRating = () => onRequestRating?.({ id: meta.claim_id, ratee: meta.ratee });

    // ── Resolve the button/info state: mode = 'action' | 'rate' | 'status' ──
    let mode = 'status';
    let label;
    let Icon = CheckCircle;
    let tone = 'bg-secondary text-base'; // primary action color
    let done = false;
    let onClick = null;

    if (template === 'verification') {
        if (isVerified) {
            label = t('chat.itemVerified');
            Icon = ShieldCheck;
            tone = 'bg-label-found text-base';
            done = true;
        } else if (viewerIsHolder) {
            mode = 'action';
            label = t('chat.verifyItem');
            Icon = ShieldCheck;
            onClick = () => setConfirming(true);
        } else {
            // The other party sees the holder's card as a status only.
            label = t('chat.awaitingVerification');
            Icon = Clock;
            tone = 'bg-highlight text-tertiary';
        }
    } else {
        // received
        if (completed && viewerIsRecipient && !rated) {
            // Both sides confirmed but the recipient hasn't rated yet.
            mode = 'rate';
            label = t('profile.giveRating');
            Icon = Star;
            tone = 'bg-highlight text-tertiary';
            onClick = openRating;
        } else if (isReceived) {
            label = t('chat.itemReceived');
            Icon = PackageCheck;
            tone = 'bg-label-found text-base';
            done = true;
        } else if (viewerIsRecipient) {
            // Gate "Item Received" on the holder verifying the item first, so the
            // recipient can't confirm receipt prematurely and isn't left confused.
            if (!meta.verified) {
                mode = 'locked';
                label = t('chat.waitingForVerification');
                Icon = Lock;
                tone = 'bg-gray-100 text-tertiary/50';
            } else {
                mode = 'action';
                label = t('chat.itemReceived');
                Icon = PackageCheck;
                onClick = () => setConfirming(true);
            }
        } else {
            // The other party sees the recipient's card as a status only.
            label = t('chat.awaitingRecipient');
            Icon = Clock;
            tone = 'bg-highlight text-tertiary';
        }
    }

    // Reminder copy shown before the verify/receive action is committed.
    const confirmPrompt = template === 'verification'
        ? t('chat.verifyGenuineItemPrompt')
        : t('chat.confirmReceivedPrompt');

    return (
        <div className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {!isOwn && (
                <div className="mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-base ring-2 ring-[#F7D8B0] md:h-9 md:w-9">
                    <img
                        src={getSenderAvatar(message)}
                        alt={message.senderName || t('chat.userFallback')}
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
                        {isLost ? t('profile.lostItem') : t('profile.foundItem')}
                    </span>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 p-3">
                    <p className="font-quicksand text-[11px] font-bold uppercase tracking-wide text-secondary">
                        {template === 'verification' ? t('chat.itemVerification') : t('chat.itemHandover')}
                    </p>
                    <h4 className="line-clamp-2 font-quicksand text-sm font-bold leading-tight text-tertiary">
                        {post.title || t('chat.item')}
                    </h4>

                    <p className="font-roboto text-[11px] leading-snug text-tertiary/70">
                        {template === 'verification'
                            ? t('chat.confirmGenuineOwnerItem')
                            : t('chat.confirmReceivedBack')}
                    </p>

                    {error && (
                        <p className="rounded-md bg-red-50 px-2 py-1 text-[10px] text-red-500">{error}</p>
                    )}

                    {/* Action / status */}
                    {confirming ? (
                        // Reminder step — make the user really confirm before it counts.
                        <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-highlight/40 p-2">
                            <p className="text-center font-quicksand text-[11px] font-semibold leading-snug text-tertiary">
                                {confirmPrompt}
                            </p>
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={runAction}
                                    disabled={loading}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary py-1.5 font-quicksand text-xs font-bold text-base shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                    {t('chat.yesConfirm')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirming(false)}
                                    disabled={loading}
                                    className="flex-1 rounded-lg bg-base py-1.5 font-quicksand text-xs font-bold text-tertiary/70 shadow-sm transition-all hover:bg-gray-100 disabled:opacity-60"
                                >
                                    {t('profile.cancel')}
                                </button>
                            </div>
                        </div>
                    ) : mode === 'locked' ? (
                        // Disabled until the item holder verifies, with a short note
                        // so the recipient understands why they must wait.
                        <div className="mt-1 flex flex-col gap-1">
                            <div
                                className={`flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl ${tone} py-2 font-quicksand text-xs font-bold`}
                            >
                                <Lock size={14} />
                                {label}
                            </div>
                            <p className="text-center font-roboto text-[10px] leading-snug text-tertiary/60">
                                {t('chat.waitingHolderVerify')}
                            </p>
                        </div>
                    ) : mode !== 'status' ? (
                        <button
                            type="button"
                            onClick={onClick}
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
