import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import IncomingRequestModal from './IncomingRequestModal';
import SentRequestModal from './SentRequestModal';
import RateUserModal from './RateUserModal';

const getLocation = (post) =>
    (typeof post?.location === 'object' ? post?.location?.place_name : post?.location) || 'Unknown location';

const statusConfig = {
    pending: {
        label: 'Waiting...',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
    },
    accepted: {
        label: 'Accepted',
        className: 'bg-green-100 text-green-700 border border-green-200',
    },
    rejected: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700 border border-red-200',
    },
    completed: {
        label: 'Completed',
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
};

function ClaimCard({ claim, mode, onClick }) {
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

                    <div className="inline-flex items-center gap-1.5 bg-tertiary text-base text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{getLocation(post)}</span>
                    </div>

                    <p className="text-sm text-tertiary/80 line-clamp-2 mb-2 font-medium">
                        {post?.description}
                    </p>

                    <Link
                        href={`/posts/${claim.post_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-secondary font-bold hover:underline"
                    >
                        Read More
                    </Link>

                    {mode === 'incoming' && claim.claimant && (
                        <p className="text-xs text-tertiary/50 mt-1.5 font-medium">
                            Requested by @{claim.claimant.username || claim.claimant.name}
                        </p>
                    )}
                </div>

                {/* Badge */}
                <div className="flex justify-end mt-4 sm:mt-0">
                    {mode === 'incoming' ? (
                        <span className={`text-sm font-bold px-5 py-1.5 rounded-lg shadow-sm text-base ${
                            post?.type === 'found' ? 'bg-label-found' : 'bg-label-lost'
                        }`}>
                            {post?.type === 'found' ? 'Found Item' : 'Lost Item'}
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
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left bg-secondary rounded-[20px] p-3 shadow-sm hover:shadow-md hover:brightness-[0.97] transition-all duration-200"
        >
            {inner}
        </button>
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
    const [activeSubTab, setActiveSubTab] = useState('incoming');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [selectedSentClaim, setSelectedSentClaim] = useState(null);
    const [resolvingClaim, setResolvingClaim] = useState(null); // claim to rate after resolve

    const handleResolve = (claim) => {
        setSelectedClaim(null);
        setResolvingClaim(claim);
    };

    const handleReject = () => {
        // Modal will close, page reloads via router.reload() in IncomingRequestModal
    };

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
                    Incoming Request
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSubTab('sent')}
                    className={`flex-1 py-2.5 rounded-xl font-quicksand font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        activeSubTab === 'sent'
                            ? 'bg-highlight text-tertiary shadow-sm'
                            : 'text-tertiary/60 hover:text-tertiary'
                    }`}
                >
                    <span className="w-2 h-2 rounded-sm bg-current inline-block shrink-0" />
                    Sent Request
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
                            onClick={() => setSelectedClaim(claim)}
                        />
                    ))
                    : <EmptyState message="No incoming requests yet for your posts." />
                )
                : (sentClaims.length > 0
                    ? sentClaims.map((claim) => (
                        <ClaimCard
                    