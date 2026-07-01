import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import IncomingRequestModal from './IncomingRequestModal';
import SentRequestModal from './SentRequestModal';
import RateUserModal from './RateUserModal';
import { useSeenClaims } from '@/hooks/useSeenClaims';
import { useTranslation } from '@/hooks/useTranslation';

const getLocation = (post, t) =>
    (typeof post?.location === 'object' ? post?.location?.place_name : post?.location) || t('profile.unknownLocation');

const getStatusConfig = (t) => ({
    pending: {
        label: t('profile.statusWaiting'),
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
    },
    accepted: {
        label: t('profile.statusAccepted'),
        className: 'bg-green-100 text-green-700 border border-green-200',
    },
    rejected: {
        label: t('profile.statusRejected'),
        className: 'bg-red-100 text-red-700 border border-red-200',
    },
    completed: {
        label: t('profile.completed'),
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
});

// A found-post request the requester can now rate: the finder returned the item
// (claim completed) but no rating has been left yet.
const needsRating = (claim) =>
    claim.post?.type === 'found' && claim.status === 'completed' && !claim.rating;

function ClaimCard({ claim, mode, onClick, isNew, rateable }) {
    const { t } = useTranslation();
    const statusConfig = getStatusConfig(t);
    const post = claim.post;
    const imageUrl = post?.image_url
        || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop';

    const inner = (
        <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">
            {/* Gambar */}
            <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                <img src={imageUrl} alt={post?.title} className="w-full h-full object-cover" />
            </div>

            {/* Detail */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                    <h3 className="text-xl font-bold text-tertiary mb-1.5 truncate">{post?.title}</h3>

                    <div className="flex items-center gap-1.5 bg-tertiary text-base text-xs font-semibold px-3 py-1 rounded-full mb-3 max-w-full overflow-hidden">
                        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="truncate">{getLocation(post, t)}</span>
                    </div>

                    <p className="text-sm text-tertiary/80 line-clamp-2 mb-2 font-medium">
                        {post?.description}
                    </p>

                    <Link
                        href={`/posts/${claim.post_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-secondary font-bold hover:underline"
                    >
                        {t('profile.readMore')}
                    </Link>

                    {mode === 'incoming' && claim.claimant && (
                        <p className="text-xs text-tertiary/50 mt-1.5 font-medium">
                            {t('profile.requestedBy')} @{claim.claimant.username || claim.claimant.name}
                        </p>
                    )}
                </div>

                {/* Badge */}
                <div className="flex justify-end mt-4 sm:mt-0">
                    {mode === 'incoming' ? (
                        <span className={`text-sm font-bold px-5 py-1.5 rounded-lg shadow-sm text-base ${
                            post?.type === 'found' ? 'bg-label-found' : 'bg-label-lost'
                        }`}>
                            {post?.type === 'found' ? t('profile.foundItem') : t('profile.lostItem')}
                        </span>
                    ) : rateable ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg bg-highlight text-tertiary shadow-sm">
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            {t('profile.giveRating')}
                        </span>
                    ) : (
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-lg ${
                            statusConfig[claim.status]?.className ?? 'bg-gray-100 text-gray-500'
                        }`}>
                            {statusConfig[claim.status]?.label ?? claim.status}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {rateable ? (
                <span className="absolute -top-1.5 -right-1.5 z-10 bg-highlight text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
                    ★ {t('profile.rate')}
                </span>
            ) : isNew && (
                <span className="absolute -top-1.5 -right-1.5 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
                    {t('profile.new')}
                </span>
            )}
            <button
                type="button"
                onClick={onClick}
                className={`w-full text-left rounded-[20px] p-3 cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] ${
                    isNew
                        ? 'bg-secondary ring-2 ring-tertiary/40 shadow-md'
                        : 'bg-secondary shadow-sm'
                }`}
            >
                {inner}
            </button>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <svg className="w-12 h-12 text-secondary/40 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <p className="font-quicksand font-semibold text-tertiary/50 text-sm">{message}</p>
        </div>
    );
}

export default function RequestTab({ incomingClaims = [], sentClaims = [] }) {
    const { t } = useTranslation();
    const [activeSubTab, setActiveSubTab] = useState('incoming');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [selectedSentClaim, setSelectedSentClaim] = useState(null);
    const [resolvingClaim, setResolvingClaim] = useState(null); // claim to rate after resolve
    const { seenIds, markAllSeen } = useSeenClaims();

    const allClaimIds = [
        ...incomingClaims.map(c => c.id),
        ...sentClaims.map(c => c.id),
    ];

    const handleResolve = (claim) => {
        setSelectedClaim(null);
        // Only the item recipient rates the finder. The owner is the recipient
        // only for lost posts; for found posts the claimant rates via chat.
        if (claim?.post?.type === 'lost') {
            setResolvingClaim(claim);
        }
    };

    const handleReject = () => {
        // Modal will close, page reloads via router.reload() in IncomingRequestModal
    };

    const pendingIncoming = incomingClaims.filter(c => c.status === 'pending' && !seenIds.has(c.id)).length;
    // Sent-tab badge counts requests still waiting AND found-post requests that
    // are now rateable, so the user is nudged to open them and leave a rating.
    const pendingSent = sentClaims.filter(
        c => (c.status === 'pending' && !seenIds.has(c.id)) || needsRating(c)
    ).length;

    return (
        <div className="flex flex-col gap-4">
            {/* Sub-tab toggle */}
            <div className="bg-secondary/30 rounded-2xl p-1.5 flex gap-1">
                <button
                    type="button"
                    onClick={() => setActiveSubTab('incoming')}
                    className={`flex-1 py-2.5 rounded-xl font-quicksand font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        activeSubTab === 'incoming'
                            ? 'bg-tertiary text-base shadow-sm'
                            : 'text-tertiary/60 hover:text-tertiary'
                    }`}
                >
                    <span className="w-2 h-2 rounded-full bg-current inline-block shrink-0" />
                    {t('profile.incomingRequest')}
                    {pendingIncoming > 0 && (
                        <span className="ml-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                            {pendingIncoming}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSubTab('sent')}
                    className={`flex-1 py-2.5 rounded-xl font-quicksand font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        activeSubTab === 'sent'
                            ? 'bg-tertiary text-base shadow-sm'
                            : 'text-tertiary/60 hover:text-tertiary'
                    }`}
                >
                    <span className="w-2 h-2 rounded-sm bg-current inline-block shrink-0" />
                    {t('profile.sentRequest')}
                    {pendingSent > 0 && (
                        <span className="ml-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                            {pendingSent}
                        </span>
                    )}
                </button>
            </div>

            {/* Konten */}
            {activeSubTab === 'incoming'
                ? (incomingClaims.length > 0
                    ? incomingClaims.map((claim) => (
                        <ClaimCard
                            key={claim.id}
                            claim={claim}
                            mode="incoming"
                            isNew={claim.status === 'pending' && !seenIds.has(claim.id)}
                            onClick={() => { markAllSeen(allClaimIds); setSelectedClaim(claim); }}
                        />
                    ))
                    : <EmptyState message={t('profile.noIncomingRequests')} />
                )
                : (sentClaims.length > 0
                    ? sentClaims.map((claim) => (
                        <ClaimCard
                            key={claim.id}
                            claim={claim}
                            mode="sent"
                            isNew={claim.status === 'pending' && !seenIds.has(claim.id)}
                            rateable={needsRating(claim)}
                            onClick={() => { markAllSeen(allClaimIds); setSelectedSentClaim(claim); }}
                        />
                    ))
                    : <EmptyState message={t('profile.noSentRequests')} />
                )
            }

            {/* Incoming Request Modal */}
            {selectedClaim && (
                <IncomingRequestModal
                    claim={selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    onResolve={handleResolve}
                    onReject={handleReject}
                />
            )}

            {/* Sent Request Modal */}
            {selectedSentClaim && (
                <SentRequestModal
                    claim={selectedSentClaim}
                    onClose={() => setSelectedSentClaim(null)}
                />
            )}

            {/* Rate User Modal (after resolve) */}
            {resolvingClaim && (
                <RateUserModal
                    claim={resolvingClaim}
                    onClose={() => setResolvingClaim(null)}
                />
            )}
        </div>
    );
}
