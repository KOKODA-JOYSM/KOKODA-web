import React, { useState, useEffect } from 'react';
import { MessageSquare, HandHelping, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import RequestModal from './RequestModal';

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
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [claimStatus, setClaimStatus] = useState(null); // null | 'pending' | 'accepted' | 'rejected' | 'completed'
    const [loadingStatus, setLoadingStatus] = useState(true);

    const isFounded = post.type === 'found';

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
            } else {
                setClaimStatus(null);
            }
        } catch (error) {
            console.error('Failed to fetch claim status:', error);
            setClaimStatus(null);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleRequestSuccess = (claim) => {
        setClaimStatus(claim.status);
    };

    const handleChat = () => {
        // Redirect to chat page with the post owner
        window.location.href = `/chat?user=${post.user_id}`;
    };

    // Status badge config
    const statusConfig = {
        pending: {
            icon: Clock,
            label: 'Request Sent',
            sublabel: 'Waiting for owner\'s response',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-700',
            iconColor: 'text-amber-500',
        },
        accepted: {
            icon: CheckCircle,
            label: 'Request Accepted!',
            sublabel: 'Please contact the owner via chat',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            iconColor: 'text-green-500',
        },
        rejected: {
            icon: XCircle,
            label: 'Request Rejected',
            sublabel: 'The owner has rejected your request',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-700',
            iconColor: 'text-red-500',
        },
        completed: {
            icon: CheckCircle,
            label: 'Completed',
            sublabel: 'Item has been returned',
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
                {/* Status Badge (if already claimed) */}
                {claimStatus && statusConfig[claimStatus] && (
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
                        disabled={loadingStatus || !!claimStatus}
                        className={`
                            flex-1 flex items-center justify-center gap-2.5
                            ${isCompact ? 'px-4 py-2.5' : 'px-5 py-3.5'}
                            rounded-xl font-quicksand font-semibold
                            transition-all duration-200
                            ${claimStatus
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
                            {claimStatus
                                ? 'Already Requested'
                                : isFounded
                                    ? 'This is Mine'
                                    : 'I Found This'}
                        </span>
                    </button>

                    {/* Chat Button */}
                    <button
                        onClick={handleChat}
                        className={`
                            flex-1 flex items-center justify-center gap-2.5
                            ${isCompact ? 'px-4 py-2.5' : 'px-5 py-3.5'}
                            rounded-xl font-quicksand font-semibold
                            border-2 border-primary text-tertiary
                            transition-all duration-200
                            hover:bg-primary hover:text-white hover:shadow-md
                            active:scale-[0.97] cursor-pointer
                            ${isCompact ? 'text-sm' : 'text-base'}
                        `}
                    >
                        <MessageSquare size={isCompact ? 16 : 18} />
                        <span>Chat Now</span>
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
