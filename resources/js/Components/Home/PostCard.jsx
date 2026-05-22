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
    const labelColor = isFounded ? 'bg-label-found text-white' : 'bg-label-lost text-white';

    // Always use the image_url from post object (already mapped to full URL by backend)
    const imageUrl = post.image_url || '/images/default.img.webp';

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, {
                id: comments.length + 1,
                user: 'You',
                avatar: '👤',
                text: newComment,
            }]);
            setNewComment('');
        }
    };

    return (
        <>
            {!showComments ? (
                /* ─── Normal Card ─── */
                <div
                    onClick={() => setShowDetail(true)}
                    className="bg-base rounded-2xl overflow-hidden shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 w-full max-w-2xl mx-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        {/* Left: avatar + name */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center text-sm font-bold text-tertiary flex-shrink-0">
                                {post.user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="font-quicksand text-sm font-semibold text-tertiary truncate">
                                {post.user?.username ? `@${post.user.username}` : `@${post.user?.name || 'Unknown'}`}
                            </span>
                        </div>

                        {/* Right: location */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-text-field flex-shrink-0 max-w-[40%]">
                            <MapPin size={12} className="flex-shrink-0" />
                            <span className="truncate">{post.location}</span>
                        </div>
                    </div>

                    {/* Location on mobile (below header) */}
                    {post.location && (
                        <div className="sm:hidden px-4 py-1.5 flex items-center gap-1.5 text-xs text-gray-text-field border-b border-gray-50">
                            <MapPin size={11} />
                            <span className="truncate">{post.location}</span>
                        </div>
                    )}

                    {/* Image */}
                    <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/images/default.img.webp'; }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
                        {/* Actions row */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(true);
                                }}
                                className="p-2 rounded-full text-gray-text-field hover:text-background hover:bg-primary transition-all duration-200"
                            >
                                <MessageCircle size={22} />
                            </button>

                            <div className={`${labelColor} text-xs font-bold font-quicksand px-3 py-1 rounded-full whitespace-nowrap`}>
                                {isFounded ? 'FOUND' : 'LOST'}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <h3 className="font-quicksand text-base font-bold text-tertiary leading-snug mb-1">
                                {post.title}
                            </h3>
                            <p className="text-sm text-tertiary leading-relaxed line-clamp-2" style={{ color: '#311A05' }}>
                                {post.description}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* ─── Comments View ─── */
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
