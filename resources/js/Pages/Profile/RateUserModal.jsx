import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, Star, ArrowRight, Loader2 } from 'lucide-react';

export default function RateUserModal({ claim, onClose }) {
    const [score, setScore] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const claimant = claim.claimant;
    const username = claimant?.username || claimant?.name || 'this user';

    const claimantAvatar = claimant?.profile_icon
        ? ('/' + claimant.profile_icon)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(claimant?.name || 'User')}&background=F4C799&color=311A05`;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleSubmit = async () => {
        if (score === 0) {
            setError('Please select a rating before submitting.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await window.axios.post('/api/ratings', {
                claim_id: claim.id,
                score,
            });
            onClose();
            router.reload();
        } catch (e) {
            setError(e.response?.data?.error || 'Failed to submit rating. Please try again.');
            setLoading(false);
        }
    };

    const handleSkip = () => {
        onClose();
        router.reload();
    };

    const displayScore = hovered || score;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[80]"
                style={{ animation: 'ruFadeIn 0.2s ease' }}
            />

            {/* Modal */}
            <div
                className="fixed z-[80] bg-white shadow-2xl flex flex-col items-center text-center"
                style={{
                    animation: 'ruBounceIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(92vw, 360px)',
                    borderRadius: '1.5rem',
                    padding: '2rem 1.75rem 1.75rem',
                }}
            >
                {/* Close */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 transition-all"
                >
                    <X size={16} />
                </button>

                {/* Avatar with badge */}
                <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-100 bg-orange-50">
                        <img
                            src={claimantAvatar}
                            alt={username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Checkmark badge */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-quicksand font-bold text-tertiary text-xl mb-1">
                    Rate this user
                </h3>
                <p className="font-quicksand text-sm text-gray-500 mb-6">
                    How was your experience with{' '}
                    <span className="font-semibold text-tertiary">@{username}</span>?
                </p>

                {/* Stars */}
                <div className="flex gap-2 mb-6" onMouseLeave={() => setHovered(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setScore(star)}
                            onMouseEnter={() => setHovered(star)}
                            className="transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={36}
                                className={`transition-colors ${
                                    star <= displayScore
                                        ? 'text-highlight fill-highlight'
                                        : 'text-gray-300 fill-gray-100'
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {error && (
                    <p className="text-xs text-red-500 font-quicksand mb-3 bg-red-50 px-3 py-2 rounded-lg w-full text-left">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || score === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-secondary text-base font-quicksand font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 mb-3"
                >
                    {loading
                        ? <Loader2 size={18} className="animate-spin" />
                        : <>Submit Rating <ArrowRight size={16} /></>
                    }
                </button>

                {/* Skip */}
                <button
                    onClick={handleSkip}
                    disabled={loading}
                    className="font-quicksand text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                    Skip for now
                </button>
            </div>

            <style>{`
                @keyframes ruFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes ruBounceIn {
                    0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
                    60%  { transform: translate(-50%, -50%) scale(1.03); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>
        </>
    );
}
