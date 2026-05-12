import React, { useState } from 'react';
import PostDetailModal from './PostDetailModal';
import PostCommentsView from './PostCommentsView';
import { MessageCircle, MapPin } from 'lucide-react';

export default function PostCard({ post }) {
    const [showDetail, setShowDetail] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([
        { id: 1, user: 'mkevinn_', avatar: '👤', text: 'halo, ini yang hilang mirip yang saya punya, tolong hubungi nomo 08*******' },
        { id: 2, user: 'saurus.miaw', avatar: '🐱', text: 'dua tiga kucing melompat aku rasa ini punya teman saya, tapi boong yahahaha ayukk' },
        { id: 3, user: 'xinos-kundesu', avatar: '⭐', text: 'astanaga kok bisa hilang sih, teledor banget si orangnya, padahal penting loh ini.' },
    ]);
    const [newComment, setNewComment] = useState('');
    const isFounded = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found' : 'bg-label-lost';
    const labelText = isFounded ? 'FOUND' : 'LOST';

    const imageUrl = '/images/default.img.webp';

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, {
                id: comments.length + 1,
                user: 'You',
                avatar: '👤',
                text: newComment
            }]);
            setNewComment('');
        }
    };

    return (
        <>
            {!showComments ? (
                // Normal Card Viewz
                <div
                    onClick={() => setShowDetail(true)}
                    className="bg-base rounded-2xl overflow-hidden shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 md:max-w-[900px] lg:max-w-[1000px] mx-auto xs:min-w-[500px]"
                >
                    {/* Header - User Info & Location (mobile/tablet: location under username; desktop: location on right) */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 md:px-8 py-3 md:py-5 border-b border-gray-100">
                        {/* Left: User Avatar, Name, and (mobile) Location */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-highlight flex items-center justify-center text-sm font-bold flex-shrink-0">
                                🦹
                            </div>

                            <div className="min-w-0 w-full">
                                <div className="flex items-center justify-between md:justify-start gap-2">
                                    <span className="font-quicksand text-base md:text-xl font-semibold text-tertiary truncate">
                                        @{post.user?.name || 'Unknown'}
                                    </span>
                                </div>

                                {/* Location shown under username on mobile/tablet */}
                                <div className="mt-1 md:hidden text-sm text-gray-text-field flex items-center gap-2 w-full">
                                    <MapPin size={14} />
                                    <span className="truncate">{post.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop location */}
                        <div className="hidden md:flex items-center text-lg text-gray-text-field gap-2 md:ml-4">
                            <MapPin /> <span className="truncate">{post.location}</span>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full h-[500px] md:h-96 lg:h-[420px] overflow-hidden bg-gray-100">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Footer - Content & Actions */}
                    <div className="px-4 py-6 flex flex-col gap-6">
                        {/* Top Row: Comment Button & Label */}
                        <div className="flex justify-between items-center px-4">
                            {/* Comment Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(true);
                                }}
                                className="p-3 bg-transparent text-gray-text-field text-sm cursor-pointer transition-all duration-200 font-quicksand hover:text-background hover:bg-primary rounded-full flex-shrink-0"
                            >
                                <MessageCircle size={32} />
                            </button>

                            {/* Item Label (compact on mobile/tablet, larger on desktop) */}
                            <div className={`${labelColor} text-lg text-base px-3 py-1 rounded font-bold font-quicksand whitespace-nowrap inline-flex items-center justify-center shadow-lg`}>
                                {isFounded ? 'FOUND' : 'LOST'}
                            </div>
                        </div>

                        {/* Bottom: Content */}
                        <div className='px-8 pb-4'>
                            {/* Title */}
                            <h3 className="font-quicksand text-2xl font-bold text-tertiary m-0 mb-1.5 leading-snug">
                                {post.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xl text-gray-600 m-0 leading-relaxed line-clamp-2">
                                {post.description}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Comments View
                <PostCommentsView
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onClose={() => setShowComments(false)}
                    onAddComment={handleAddComment}
                    imageUrl={imageUrl}
                />
            )}

            {/* Detail Modal */}
            {showDetail && (
                <PostDetailModal
                    post={post}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </>
    );
}
