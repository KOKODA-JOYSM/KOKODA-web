import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import PostDetailModal from '@/Components/Home/PostDetailModal';
import CreatePostModal from '@/Components/Home/CreatePostModal';

export default function MyPostTab({ posts }) {
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    if (!posts || posts.length === 0) {
        return (
            <>
                <div className="text-center py-12 bg-secondary/10 rounded-2xl">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-tertiary font-semibold text-lg mb-2">No posts yet</p>
                    <p className="text-tertiary/60 text-sm mb-6">Create your first post to report a lost or found item.</p>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 bg-primary text-tertiary font-bold px-6 py-2.5 rounded-xl hover:bg-secondary transition-all duration-200 shadow-sm"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Create New Post
                    </button>
                </div>

                {showCreateModal && (
                    <CreatePostModal onClose={() => setShowCreateModal(false)} />
                )}
            </>
        );
    }

    const handleDelete = (post) => {
        if (!confirm(`Delete post "${post.title}"?\n\nThis action cannot be undone.`)) {
            return;
        }
        router.delete(`/posts/${post.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Inertia akan reload data otomatis via redirect dari controller
            },
        });
    };

    return (
        <>
        <div className="flex flex-col gap-4">
            {/* Header dengan count dan tombol buat post */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-tertiary/70 font-medium">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                </p>
                <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-tertiary text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all duration-200"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    New Post
                </button>
            </div>

            {posts.map((item) => (
                <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPost(item)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedPost(item);
                        }
                    }}
                    className="bg-secondary rounded-[20px] p-3 shadow-sm cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                    <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">

                        {/* Gambar */}
                        <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative">
                            <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Status badge di atas gambar */}
                            <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-bold uppercase shadow ${
                                item.status === 'resolved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-yellow-400 text-tertiary'
                            }`}>
                                {item.status === 'resolved' ? 'Resolved' : 'Active'}
                            </span>
                        </div>

                        {/* Konten */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                                {/* Title + Type Badge */}
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-tertiary leading-tight line-clamp-2 flex-1">
                                        {item.title}
                                    </h3>
                                    <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                                        item.type === 'lost'
                                            ? 'bg-label-lost text-base'
                                            : 'bg-label-found text-base'
                                    }`}>
                                        {item.type}
                                    </span>
                                </div>

                                {/* Lokasi */}
                                {item.location && (
                                    <div className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                        <span>{typeof item.location === 'object' ? item.location?.place_name : item.location}</span>
                                    </div>
                                )}

                                {/* Category */}
                                {item.category && (
                                    <span className="inline-block bg-primary/30 text-tertiary text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2 mb-2">
                                        {item.category}
                                    </span>
                                )}

                                <p className="text-sm text-tertiary/75 line-clamp-2 font-medium mt-1">{item.description}</p>
                            </div>

                            {/* Tanggal + Tombol Aksi */}
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-tertiary/50 font-medium">
                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/posts/${item.id}/edit`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-highlight text-tertiary hover:bg-yellow-400 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item);
                                        }}
                                        className="bg-label-lost/80 hover:bg-label-lost text-base text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {selectedPost && (
            <PostDetailModal
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
            />
        )}

        {showCreateModal && (
            <CreatePostModal onClose={() => setShowCreateModal(false)} />
        )}
        </>
    );
}
