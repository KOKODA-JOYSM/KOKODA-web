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
                // Normal Card View
                <div
                    onClick={() => setShowDetail(true)}
                    className="bg-base rounded-2xl overflow-hidden shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                >
                    {/* Header - User Info & Location */}
                    <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                        {/* Left: User Avatar & Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-highlight flex items-center justify-center text-sm font-bold flex-shrink-0">
                                🦹
                            </div>
                            <span className="font-quicksand text-xl font-semibold text-tertiary">
                                @{post.user?.name || 'Unknown'}
                            </span>
                        </div>

                        {/* Right: Location */}
                        <span className="text-xl text-gray-text-field flex items-center gap-2">
                            <MapPin /> {post.location}
                        </span>
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full h-[500px] overflow-hidden bg-gray-100">
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

                            {/* Item Label (Right) */}
                            <div className={`${labelColor} text-base px-3 py-1.5 rounded text-3xl font-bold font-quicksand whitespace-nowrap w-[8rem] h-[3rem] text-center content-center shadow-lg`}>
                                {isFounded ? 'FOUND ITEM' : 'LOST ITEM'}
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
