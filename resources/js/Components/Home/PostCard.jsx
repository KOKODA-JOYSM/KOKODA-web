import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import PostDetailModal from './PostDetailModal';
import PostCommentsView from './PostCommentsView';
import { MessageCircle, MapPin } from 'lucide-react';

export default function PostCard({ post }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user ?? null;

    const [showDetail,   setShowDetail]   = useState(false);
    const [showComments, setShowComments] = useState(false);

    /* ─── Comment state ─── */
    const [comments,    setComments]    = useState([]);
    const [newComment,  setNewComment]  = useState('');
    const [loading,     setLoading]     = useState(false);
    const [submitting,  setSubmitting]  = useState(false);

    /* Keep a ref to the Echo channel so we can unsubscribe on unmount */
    const echoChannelRef = useRef(null);

    const isFounded  = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found text-white' : 'bg-label-lost text-white';

    const imageUrl = post.image_url || '/images/default.img.webp';

    /* ──────────────────────────────────────────────────────────────
       Fetch comments from API & subscribe to real-time channel
       whenever the comment panel is opened for this post.
    ────────────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!showComments) return;

        // 1. Load existing comments from the API
        setLoading(true);
        window.axios
            .get(`/api/posts/${post.id}/comments`)
            .then((res) => setComments(res.data))
            .catch((err) => console.error('Failed to load comments', err))
            .finally(() => setLoading(false));

        // 2. Subscribe to the public broadcast channel for real-time updates
        if (window.Echo) {
            const channel = window.Echo.channel(`post.${post.id}`);
            channel.listen('.comment.posted', (event) => {
                setComments((prev) => {
                    // Prevent duplicates (in case we're the sender too)
                    if (prev.some((c) => c.id === event.comment.id)) return prev;
                    return [...prev, event.comment];
                });
            });
            // Remove a comment in real-time when someone deletes it
            channel.listen('.comment.deleted', (event) => {
                setComments((prev) => prev.filter((c) => c.id !== event.id));
            });
            echoChannelRef.current = channel;
        }

        // 3. Polling fallback — keeps comments live even where WebSockets
        //    aren't available (e.g. Azure prod has no Reverb server). Re-fetches
        //    the comment list every few seconds; the server list is the source
        //    of truth so this also reflects others' new + deleted comments.
        const pollId = setInterval(() => {
            window.axios
                .get(`/api/posts/${post.id}/comments`)
                .then((res) => setComments(res.data))
                .catch(() => {});
        }, 4000);

        // 4. Cleanup: leave the channel + stop polling when panel closes or unmounts
        return () => {
            clearInterval(pollId);
            if (echoChannelRef.current && window.Echo) {
                window.Echo.leaveChannel(`post.${post.id}`);
                echoChannelRef.current = null;
            }
        };
    }, [showComments, post.id]);

    /* ──────────────────────────────────────────────────────────────
       Submit a new comment via the API
    ────────────────────────────────────────────────────────────── */
    const handleAddComment = async () => {
        const text = newComment.trim();
        if (!text || submitting) return;

        setSubmitting(true);
        try {
            const res = await window.axios.post(`/posts/${post.id}/comments`, { text });
            // Optimistically add own comment immediately (broadcast goes to others)
            setComments((prev) => {
                if (prev.some((c) => c.id === res.data.id)) return prev;
                return [...prev, res.data];
            });
            setNewComment('');
        } catch (err) {
            console.error('Failed to post comment', err);
        } finally {
            setSubmitting(false);
        }
    };

    /* ──────────────────────────────────────────────────────────────
       Delete a comment via the API (author or post owner only)
    ────────────────────────────────────────────────────────────── */
    const handleDeleteComment = async (commentId) => {
        // Optimistically remove from our own list (broadcast notifies others)
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        try {
            await window.axios.delete(`/posts/${post.id}/comments/${commentId}`);
        } catch (err) {
            console.error('Failed to delete comment', err);
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
                        {/* Left: avatar + name — links to the author's profile */}
                        {post.user?.id ? (
                            <Link
                                href={`/profile/${post.user.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-3 min-w-0 group/profile"
                            >
                                <div className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center text-sm font-bold text-tertiary flex-shrink-0">
                                    {post.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-quicksand text-sm font-semibold text-tertiary truncate group-hover/profile:underline">
                                    {post.user?.username ? `@${post.user.username}` : `@${post.user?.name || 'Unknown'}`}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center text-sm font-bold text-tertiary flex-shrink-0">
                                    {post.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-quicksand text-sm font-semibold text-tertiary truncate">
                                    {post.user?.username ? `@${post.user.username}` : `@${post.user?.name || 'Unknown'}`}
                                </span>
                            </div>
                        )}

                        {/* Right: location */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-tertiary flex-shrink-0 max-w-[40%]">
                            <MapPin size={12} className="flex-shrink-0" />
                            <span className="truncate">
                                {typeof post.location === 'object' ? post.location?.place_name : post.location}
                            </span>
                        </div>
                    </div>

                    {/* Location on mobile (below header) */}
                    {post.location && (
                        <div className="sm:hidden px-4 py-1.5 flex items-center gap-1.5 text-xs text-tertiary border-b border-gray-50">
                            <MapPin size={11} />
                            <span className="truncate">
                                {typeof post.location === 'object' ? post.location.place_name : post.location}
                            </span>
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
                            {/* Comment button with count badge */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(true);
                                }}
                                className="flex items-center gap-1.5 p-2 rounded-full text-gray-text-field hover:text-background hover:bg-primary transition-all duration-200"
                                aria-label="View comments"
                            >
                                <MessageCircle size={22} />
                                {post.comments_count > 0 && (
                                    <span className="text-xs font-quicksand font-semibold leading-none">
                                        {post.comments_count}
                                    </span>
                                )}
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
                    post={post}
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onClose={() => {
                        setShowComments(false);
                        setComments([]);
                        setNewComment('');
                    }}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                    imageUrl={imageUrl}
                    loading={loading}
                    submitting={submitting}
                    currentUser={currentUser}
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
