import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';

const getLocation = (post) =>
    (typeof post?.location === 'object' ? post?.location?.place_name : post?.location) || 'Indonesia';

// Maps a claim's backend status to the visual status pill from the SVG design.
const statusPillConfig = {
    completed: {
        label: 'Request Accepted',
        className: 'bg-secondary',
        Icon: CheckCircle2,
    },
    // Set once the post owner has verified/received the item (handshake started).
    accepted: {
        label: 'Request Accepted',
        className: 'bg-secondary',
        Icon: CheckCircle2,
    },
    rejected: {
        label: 'Request Rejected',
        className: 'bg-label-lost',
        Icon: XCircle,
    },
    pending: {
        label: 'Waiting for Response',
        className: 'bg-highlight text-tertiary',
        Icon: Clock,
    },
};

export default function SentRequestModal({ claim, onClose }) {
    const post = claim.post;
    const owner = post?.user || claim.owner;
    const location = getLocation(post);

    const imageUrl = post?.image_url
        || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800&auto=format&fit=crop';

    const ownerAvatar = owner?.profile_icon
        ? ('/' + owner.profile_icon)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(owner?.name || 'User')}&background=F4C799&color=311A05`;

    const requestDate = claim.created_at
        ? new Date(claim.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          })
        : '-';

    const pill = statusPillConfig[claim.status] || statusPillConfig.pending;
    const StatusIcon = pill.Icon;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleChat = async () => {
        try {
            await window.axios.post(`/api/claims/${claim.id}/follow-up`);
        } catch (e) {
            // Non-fatal: still open the chat even if the card couldn't be posted.
        }
        router.visit(`/chat?user=${claim.owner_id}`);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[70]"
                onClick={onClose}
                style={{ animation: 'srFadeIn 0.2s ease' }}
            />

            {/* Modal */}
            <div
                className="fixed z-[70] bg-background shadow-2xl overflow-hidden flex flex-col border border-tertiary/80"
                style={{
                    animation: 'srSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(95vw, 1100px)',
                    maxHeight: '90vh',
                    borderRadius: '0.75rem',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src={ownerAvatar}
                            alt={owner?.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-secondary/30"
                        />
                        <span className="font-quicksand font-bold text-tertiary text-sm">
                            @{owner?.username || owner?.name || 'unknown'}
                        </span>
                        <span className={`text-xs font-quicksand font-bold px-3 py-1 rounded-full text-base ${
                            post?.type === 'lost' ? 'bg-label-lost' : 'bg-label-found'
                        }`}>
                            {post?.type === 'lost' ? 'Lost Item' : 'Found Item'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-base hover:bg-gray-100 text-gray-400 hover:text-secondary transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row flex-1 overflow-auto min-h-0">
                    {/* Left: Image + Map */}
                    <div className="w-full md:w-[58%] flex flex-col gap-4 shrink-0 px-5 md:pl-10 md:pr-7 pb-6">
                        <div className="h-52 md:h-64 bg-gray-200 overflow-hidden rounded-xl border-2 border-secondary/60">
                            <img
                                src={imageUrl}
                                alt={post?.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-h-[160px] bg-gray-100 overflow-hidden rounded-xl border-2 border-secondary/60">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '160px' }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-[3px] bg-secondary shrink-0" />

                    {/* Right: Details + Status */}
                    <div className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
                        <h2 className="font-quicksand font-bold text-tertiary text-2xl md:text-3xl leading-tight">
                            {post?.title}
                        </h2>

                        <hr className="border-gray-200/60" />

                        <div>
                            <p className="font-quicksand text-sm text-tertiary/80 leading-relaxed">
                                <span className="font-bold text-tertiary">Request detail:</span>{' '}
                                {claim.message || <span className="italic text-tertiary/50">No message provided.</span>}
                            </p>
                        </div>

                        <p className="font-quicksand text-sm text-tertiary mt-auto">
                            <span className="font-bold">Waktu Ditemukan:</span>{' '}
                            {requestDate}
                        </p>

                        {/* Status */}
                        <div className="flex flex-col gap-3 pt-1">
                            <p className="font-quicksand font-bold text-tertiary text-center text-sm">
                                Request Status
                            </p>

                            <div className={`mx-auto w-full max-w-[380px] flex items-center justify-center gap-2 py-3 rounded-full text-base font-quicksand font-bold uppercase text-sm tracking-wide shadow-md ${pill.className}`}>
                                <StatusIcon size={18} />
                                {pill.label}
                            </div>

                            <button
                                onClick={handleChat}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-label-found text-base font-quicksand font-bold text-sm hover:opacity-90 transition-all shadow-md"
                            >
                                <MessageSquare size={16} />
                                Continue Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes srFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes srSlideUp {
                    from { opacity: 0; transform: translate(-50%, -48%); }
                    to   { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
        </>
    );
}
