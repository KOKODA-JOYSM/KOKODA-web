import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { MessageSquare, HandHelping, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import RequestModal from './RequestModal';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * PostActionButtons — Reusable "Request Item" & "Chat Owner" buttons.
 *
 * Displayed in PostDetailModal and Show.jsx for posts owned by other users.
 *
 * Props:
 * - post: post object (must have id, user_id, user, type)
 * - variant: 'default' | 'compact' — controls button size
 */
export default function PostActionButtons({ post, variant = 'default' }) {
    const { t } = useTranslation();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [claimStatus, setClaimStatus] = useState(null); // null | 'pending' | 'accepted' | 'rejected' | 'completed'
    const [claimId, setClaimId] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    const isFounded = post.type === 'found';
    const postResolved = post.status === 'resolved';
    // A request still in flight blocks re-requesting; completed/rejected does not.
    const activeClaim = claimStatus === 'pending' || claimStatus === 'accepted';
    const showBadge = !!claimStatus && (activeClaim || postResolved);
    const disableRequest = loadingStatus || activeClaim || postResolved;

    // Fetch claim status on mount
    useEffect(() => {
        fetchClaimStatus();
    }, [post.id]);

    const fetchClaimStatus = async () => {
        setLoadingStatus(true);
        try {
            const response = await window.axios.get(`/api/posts/${post.id}/claim-status`);
            if (response.data.has_claim) {
                setClaimStatus(response.data.claim.status);
                setClaimId(response.data.claim.id);
            } else {
                setClaimStatus(null);
                setClaimId(null);
            }
        } catch (error) {
            console.error('Failed to fetch claim status:', error);
            setClaimStatus(null);
            setClaimId(null);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleRequestSuccess = (claim) => {
        setClaimStatus(claim.status);
        setClaimId(claim.id);
    };

    const handleChat = async () => {
        // If the user has a request for this post, drop the handshake cards into
        // the conversation first so the templates also appear when chatting
        // straight from a post (home/search), not only via the request tabs.
        setChatLoading(true);
        try {
            if (claimId) {
                await window.axios.post(`/api/claims/${claimId}/follow-up`);
            }
        } catch (e) {
            // Non-fatal: open the chat regardless.
        }
        router.visit(`/chat?user=${post.user_id}`);
    };

    // Status badge config
    const statusConfig = {
        pending: {
            icon: Clock,
            label: t('post.requestSent'),
            sublabel: t('post.waitingOwnerResponse'),
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-700',
            iconColor: 'text-amber-500',
        },
        accepted: {
            icon: CheckCircle,
            label: t('post.requestAccepted'),
            sublabel: t('post.contactOwnerViaChat'),
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            iconColor: 'text-green-500',
        },
        rejected: {
            icon: XCircle,
            label: t('profile.requestRejected'),
            sublabel: t('post.ownerRejectedRequest'),
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-700',
            iconColor: 'text-red-500',
        },
        completed: {
            icon: CheckCircle,
            label: t('profile.completed'),
            sublabel: t('post.itemHasBeenReturned'),
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-500',
        },
    };

    const isCompact = variant === 'compact';

    return (
        <>
            <div
                className={`flex flex-col gap-3 w-full ${isCompact ? '' : 'mt-2'}`}
                style={{ animation: 'pabFadeInUp 0.35s ease' }}
            >
                {/* Status Badge (only while a claim is active or the post is resolved) */}
                {showBadge && statusConfig[claimStatus] && (
                    <div
                        className={`flex items-center gap-3 ${statusConfig[claimStatus].bgColor} ${statusConfig[claimStatus].borderColor} border rounded-xl px-4 py-3`}
                        style={{ animation: 'pabFadeInUp 0.3s ease' }}
                    >
                        {React.createElement(statusConfig[claimStatus].icon, {
                            size: 20,
                            className: `${statusConfig[claimStatus].iconColor} flex-shrink-0`,
                        })}
                        <div className="min-w-0 flex-1">
                            <p className={`font-quicksand font-semibold text-sm ${statusConfig[claimStatus].textColor}`}>
                                {statusConfig[claimStatus].label}
                            </p>
                            <p className="font-quicksand text-xs text-gray-500 mt-0.5">
                                {statusConfig[claimStatus].sublabel}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={`flex gap-3 w-full ${isCompact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'}`}>
                    {/* Request Button */}
                    <button
                        onClick={() => setShowRequestModal(true)}
                        disabled={disableRequest}
                        className={`
                            flex-1 flex items-center justify-center gap-2.5
                            ${isCompact ? 'px-4 py-2.5' : 'px-5 py-3.5'}
                            rounded-xl font-quicksand font-semibold
                            transition-all duration-200
                            ${disableRequest && !loadingStatus
                                ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                                : 'bg-secondary text-white shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.97] cursor-pointer'
                            }
                            ${isCompact ? 'text-sm' : 'text-base'}
                        `}
                    >
                        {loadingStatus ? (
                            <Loader2 size={isCompact ? 16 : 18} className="animate-spin" />
                        ) : (
                            <HandHelping size={isCompact ? 16 : 18} />
                        )}
                        <span>
                            {postResolved
                                ? t('post.alreadyResolved')
                                : activeClaim
                                    ? t('post.alreadyRequested')
                                    : isFounded
                                        ? t('post.thisIsMine')
                                        : t('post.iFoundThis')}
                        </span>
                    </button>

                    {/* Chat Button */}
                    <button
                        onClick={handleChat}
                        disabled={chatLoading}
                        className={`
                            flex-1 flex items-center justify-center gap-2.5
                            ${isCompact ? 'px-4 py-2.5' : 'px-5 py-3.5'}
                            rounded-xl font-quicksand font-semibold
                            border-2 border-primary text-tertiary
                            transition-all duration-200
                            hover:bg-primary hover:text-white hover:shadow-md
                            active:scale-[0.97] cursor-pointer disabled:opacity-60
                            ${isCompact ? 'text-sm' : 'text-base'}
                        `}
                    >
                        {chatLoading ? (
                            <Loader2 size={isCompact ? 16 : 18} className="animate-spin" />
                        ) : (
                            <MessageSquare size={isCompact ? 16 : 18} />
                        )}
                        <span>{t('post.chatNow')}</span>
                    </button>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <RequestModal
                    post={post}
                    onClose={() => setShowRequestModal(false)}
                    onSuccess={handleRequestSuccess}
                />
            )}

            <style>{`
                @keyframes pabFadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
