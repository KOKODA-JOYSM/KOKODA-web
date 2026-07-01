import React, { useState } from 'react';
import { X, ShieldCheck, PackageCheck, Loader2 } from 'lucide-react';

const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=200&auto=format&fit=crop';

/**
 * Small floating pop-up shown above the message input while the two chat
 * participants are mid-transaction on a claim. Pressing "send" drops the
 * handshake card(s) into the conversation (same as "Continue Chat" from the
 * request tabs) so the user can surface their card WITHOUT leaving the chat.
 *
 * It always reflects the MOST RECENT active request between the two users; when
 * that one resolves, the parent refetches and this shows the next active one
 * until every request is settled — then the pop-up disappears entirely.
 *
 * Props:
 *  - claim: { id, template: 'verification'|'received', post: {title,image_url,type} }
 *  - onSend: () => Promise — posts the follow-up (parent handles the request)
 *  - onDismiss: () => void — hide for now (reappears on reopening the chat)
 */
export default function ChatClaimPopup({ claim, onSend, onDismiss }) {
    const [loading, setLoading] = useState(false);
    const post = claim.post || {};
    const isVerify = claim.template === 'verification';
    const Icon = isVerify ? ShieldCheck : PackageCheck;

    const handleSend = async () => {
        setLoading(true);
        try {
            await onSend();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4 pb-1 pt-1">
            <div
                className="flex w-full max-w-[520px] items-center gap-3 rounded-2xl border border-secondary/55 bg-base px-3 py-2.5 shadow-lg"
                style={{ animation: 'ccpSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Thumbnail */}
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    <img
                        src={post.image_url || FALLBACK_IMG}
                        alt={post.title || 'Item'}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <p className="font-quicksand text-[10px] font-bold uppercase tracking-wide text-secondary">
                        {isVerify ? 'Item Verification' : 'Item Handover'}
                    </p>
                    <p className="truncate font-quicksand text-[13px] font-bold leading-tight text-tertiary">
                        {post.title || 'Item'}
                    </p>
                </div>

                {/* Send card */}
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={loading}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 font-quicksand text-xs font-bold text-base shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                    {isVerify ? 'Verify Card' : 'Send Card'}
                </button>

                {/* Dismiss */}
                <button
                    type="button"
                    onClick={onDismiss}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-tertiary/40 transition-colors hover:bg-gray-100 hover:text-secondary"
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>
            </div>

            <style>{`
                @keyframes ccpSlideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
