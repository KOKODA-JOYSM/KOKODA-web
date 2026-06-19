import React, { useRef, useEffect } from 'react';
import { Send, ChevronLeft, MessageCircle, Loader2, Trash2 } from 'lucide-react';

/**
 * Compute a friendly relative time string (e.g. "2 min ago", "just now").
 */
function relativeTime(isoString) {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60)   return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Avatar initials helper — uses username if available, falls back to name.
 */
function getInitial(user) {
    const src = user?.username || user?.name || '?';
    return src.charAt(0).toUpperCase();
}

export default function PostCommentsView({
    post,
    comments,
    newComment,
    setNewComment,
    onClose,
    onAddComment,
    onDeleteComment,
    imageUrl,
    loading,
    submitting,
    currentUser,
}) {
    // Post owner may moderate (delete) any comment on their own post.
    const isPostOwner = currentUser && post?.user_id === currentUser.id;
    const listRef  = useRef(null);
    const inputRef = useRef(null);

    /* Auto-scroll to the latest comment whenever the list changes */
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [comments]);

    /* Focus input on mount */
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAddComment();
        }
    };

    return (
        <div className="bg-base rounded-2xl overflow-hidden shadow-md w-full max-w-2xl mx-auto flex flex-col" style={{ maxHeight: '85vh' }}>

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary flex-shrink-0">
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition"
                    aria-label="Back"
                >
                    <ChevronLeft size={22} />
                </button>
                <h2 className="font-quicksand text-base font-bold text-tertiary flex-1 text-center">
                    Comments
                    {comments.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                            ({comments.length})
                        </span>
                    )}
                </h2>
                <div className="w-8" />
            </div>

            {/* ── Compact Image Strip ── */}
            <div
                className="w-full bg-gray-100 overflow-hidden flex-shrink-0"
                style={{ aspectRatio: '16/9', maxHeight: '180px' }}
            >
                <img src={imageUrl} alt={post?.title || 'Post'} className="w-full h-full object-cover" />
            </div>

            {/* ── Post title overlay ── */}
            {post?.title && (
                <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0">
                    <p className="font-quicksand text-xs font-semibold text-tertiary truncate">{post.title}</p>
                </div>
            )}

            {/* ── Comments List ── */}
            <div
                ref={listRef}
                className="flex flex-col gap-4 p-4 overflow-y-auto flex-1"
                style={{ minHeight: '160px' }}
            >
                {/* Loading skeleton */}
                {loading && (
                    <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm font-quicksand">Loading comments…</span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && comments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
                        <MessageCircle size={32} strokeWidth={1.5} />
                        <p className="text-sm font-quicksand">No comments yet. Be the first!</p>
                    </div>
                )}

                {/* Comment items */}
                {!loading && comments.map((comment) => {
                    const isOwn = currentUser && comment.user_id === currentUser.id;
                    const canDelete = onDeleteComment && (isOwn || isPostOwner);
                    return (
                        <div key={comment.id} className="flex gap-3 group">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center text-sm font-bold text-tertiary flex-shrink-0 uppercase">
                                {getInitial(comment.user)}
                            </div>

                            {/* Bubble */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                    <p className="font-quicksand text-sm font-semibold text-tertiary">
                                        {comment.user?.username
                                            ? `@${comment.user.username}`
                                            : (comment.user?.name || 'Unknown')}
                                        {isOwn && (
                                            <span className="ml-1.5 text-[10px] font-normal text-primary border border-primary rounded-full px-1.5 py-0.5">
                                                You
                                            </span>
                                        )}
                                    </p>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                                        {relativeTime(comment.created_at)}
                                    </span>
                                    {canDelete && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this comment?')) {
                                                    onDeleteComment(comment.id);
                                                }
                                            }}
                                            className="ml-auto flex-shrink-0 text-gray-300 hover:text-label-lost transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            aria-label="Delete comment"
                                            title="Delete comment"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <p className="font-quicksand text-sm text-gray-600 leading-relaxed break-words">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Input Area ── */}
            <div className="border-t border-gray-100 flex gap-2 px-4 py-3 flex-shrink-0">
                {currentUser ? (
                    <>
                        {/* Current user avatar */}
                        <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-xs font-bold text-tertiary flex-shrink-0 uppercase self-center">
                            {getInitial(currentUser)}
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a comment…"
                            disabled={submitting}
                            className="flex-1 bg-background border border-primary rounded-full text-sm font-quicksand text-tertiary outline-none px-4 py-2 disabled:opacity-60"
                        />

                        <button
                            onClick={onAddComment}
                            disabled={submitting || !newComment.trim()}
                            className="flex items-center justify-center text-primary hover:text-secondary transition-colors px-2 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Send comment"
                        >
                            {submitting
                                ? <Loader2 size={20} className="animate-spin" />
                                : <Send size={20} />
                            }
                        </button>
                    </>
                ) : (
                    <p className="flex-1 text-center text-sm font-quicksand text-gray-400 py-1">
                        <a href="/login" className="text-primary font-semibold hover:underline">Log in</a> to leave a comment.
                    </p>
                )}
            </div>
        </div>
    );
}
