import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * RequestModal — Confirmation modal for submitting a claim/request on a post.
 *
 * Props:
 * - post: the post object being claimed
 * - onClose: callback to close the modal
 * - onSuccess: callback after claim succeeds (receives claim data)
 */
export default function RequestModal({ post, onClose, onSuccess }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | success | error
    const [errorMessage, setErrorMessage] = useState('');

    const isFounded = post.type === 'found';

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await window.axios.post(`/posts/${post.id}/claim`, {
                message: message.trim() || null,
            });

            setStatus('success');

            // Brief delay so the success animation is visible
            setTimeout(() => {
                onSuccess?.(response.data.claim);
                onClose();
            }, 1500);
        } catch (error) {
            setStatus('error');
            const msg =
                error.response?.data?.error ||
                'An error occurred while sending your request. Please try again.';
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-[60]"
                style={{ animation: 'rmFadeIn 0.2s ease' }}
            />

            {/* Modal */}
            <div
                className="fixed z-[60] bg-background shadow-2xl overflow-hidden"
                style={{
                    animation: 'rmSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(92vw, 460px)',
                    borderRadius: '1.25rem',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60">
                    <h3 className="font-quicksand font-bold text-tertiary text-lg">
                        {isFounded ? '📦 Claim This Item' : '🔍 Submit a Request'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-base hover:bg-gray-100 text-gray-400 hover:text-secondary transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {status === 'success' ? (
                        /* Success State */
                        <div className="flex flex-col items-center justify-center py-6" style={{ animation: 'rmBounceIn 0.4s ease' }}>
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <p className="font-quicksand font-bold text-tertiary text-lg mb-1">
                                Request Sent!
                            </p>
                            <p className="font-quicksand text-sm text-gray-500 text-center">
                                The post owner will be notified about your request.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Info Card */}
                            <div className="flex items-start gap-3 bg-highlight/40 rounded-xl p-4 mb-5">
                                <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-lg">{isFounded ? '📦' : '🔍'}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-quicksand font-semibold text-tertiary text-sm leading-tight mb-0.5 line-clamp-1">
                                        {post.title}
                                    </p>
                                    <p className="font-quicksand text-xs text-gray-500">
                                        Posted by @{post.user?.username || post.user?.name || 'unknown'}
                                    </p>
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="mb-5">
                                <label className="block font-quicksand font-semibold text-sm text-tertiary mb-2">
                                    Message (optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={
                                        isFounded
                                            ? 'Explain why you believe this is yours...'
                                            : 'Describe the item you found...'
                                    }
                                    maxLength={1000}
                                    rows={4}
                                    className="w-full bg-base border border-primary/50 rounded-xl px-4 py-3 text-sm font-quicksand text-tertiary placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                                />
                                <p className="text-right text-xs text-gray-400 mt-1 font-quicksand">
                                    {message.length}/1000
                                </p>
                            </div>

                            {/* Error Message */}
                            {status === 'error' && errorMessage && (
                                <div
                                    className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
                                    style={{ animation: 'rmShakeX 0.4s ease' }}
                                >
                                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="font-quicksand text-xs text-red-600">{errorMessage}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                {status !== 'success' && (
                    <div className="flex gap-3 px-6 pb-6">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-primary text-sm font-quicksand font-semibold text-gray-500 hover:bg-red-200 hover:border-primary transition-all duration-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-secondary text-white text-sm font-quicksand font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes rmFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes rmSlideUp {
                    from { opacity: 0; transform: translate(-50%, -45%); }
                    to   { opacity: 1; transform: translate(-50%, -50%); }
                }
                @keyframes rmBounceIn {
                    0%   { opacity: 0; transform: scale(0.8); }
                    50%  { transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes rmShakeX {
                    0%, 100% { transform: translateX(0); }
                    20%  { transform: translateX(-6px); }
                    40%  { transform: translateX(6px); }
                    60%  { transform: translateX(-4px); }
                    80%  { transform: translateX(4px); }
                }
            `}</style>
        </>
    );
}
