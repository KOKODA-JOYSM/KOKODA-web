import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, CheckCircle, MessageSquare, XCircle, Loader2 } from 'lucide-react';

const getLocation = (post) =>
    (typeof post?.location === 'object' ? post?.location?.place_name : post?.location) || 'Indonesia';

export default function IncomingRequestModal({ claim, onClose, onResolve, onReject }) {
    const [loading, setLoading] = useState(null); // null | 'resolve' | 'reject'
    const [error, setError] = useState(null);

    const post = claim.post;
    const claimant = claim.claimant;
    const location = getLocation(post);

    const imageUrl = post?.image_url
        || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800&auto=format&fit=crop';

    const claimantAvatar = claimant?.profile_icon
        ? ('/' + claimant.profile_icon)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(claimant?.name || 'User')}&background=F4C799&color=311A05`;

    const requestDate = claim.created_at
        ? new Date(claim.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          })
        : '-';

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleResolve = async () => {
        setLoading('resolve');
        setError(null);
        try {
            await window.axios.patch(`/api/claims/${claim.id}/resolve`);
            onResolve(claim);
        } catch (e) {
            setError(e.response?.data?.error || 'Failed to resolve. Please try again.');
            setLoading(null);
        }
    };

    const handleReject = async () => {
        setLoading('reject');
        setError(null);
        try {
            await window.axios.patch(`/api/claims/${claim.id}/reject`);
            onReject(claim);
            onClose();
            router.reload();
        } catch (e) {
            setError(e.response?.data?.error || 'Failed to reject. Please try again.');
            setLoading(null);
        }
    };

    const handleChat = () => {
        router.visit(`/chat?user=${claim.claimant_id}`);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[70]"
                onClick={onClose}
                style={{ animation: 'imFadeIn 0.2s ease' }}
            />

            {/* Modal */}
            <div
                className="fixed z-[70] bg-background shadow-2xl overflow-hidden flex flex-col border border-tertiary/80"
                style={{
                    animation: 'imSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
                            src={claimantAvatar}
                            alt={claimant?.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-secondary/30"
                        />
                        <span className="font-quicksand font-bold text-tertiary text-sm">
                            @{claimant?.username || claimant?.name || 'unknown'}
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

                    {/* Right: Details + Actions */}
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

                        {error && (
                            <p className="text-xs text-red-500 font-quicksand bg-red-50 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-1">
                            {/* Resolve */}
                            <button
                                onClick={handleResolve}
                                disabled={!!loading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-base font-quicksand font-bold text-base hover:opacity-90 transition-all shadow-md disabled:opacity-60"
                            >
                                {loading === 'resolve'
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <CheckCircle size={18} />
                                }
                                Resolve
                            </button>

                            {/* Chat + Reject */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleChat}
                                    disabled={!!loading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-label-found text-base font-quicksand font-bold text-sm hover:opacity-90 transition-all shadow-md disabled:opacity-60"
                                >
                                    <MessageSquare size={16} />
                                    Continue Chat
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!!loading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-label-lost text-base font-quicksand font-bold text-sm hover:opacity-90 transition-all shadow-md disabled:opacity-60"
                                >
                                    {loading === 'reject'
                                        ? <Loader2 size={16} className="animate-spin" />
                                        : <XCircle size={16} />
                                    }
                                    Reject Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes imFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes imSlideUp {
                    from { opacity: 0; transform: translate(-50%, -48%); }
                    to   { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
        </>
    );
}
