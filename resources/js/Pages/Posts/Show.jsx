import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';

export default function Show({ post, auth }) {
    const isFounded = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found' : 'bg-label-lost';
    const labelText = isFounded ? 'FOUND' : 'LOST';
    const isOwnPost = auth.user.id === post.user_id;

    const imageUrl = post.image_url
        ? `/storage/${post.image_url}`
        : '/images/placeholder.jpg';

    return (
        <AppLayout title={`${post.title} - KOKODA`}>
            <div className="px-7 py-8 max-w-3xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 mb-6 text-xs font-semibold text-primary border-2 border-primary rounded-lg font-quicksand transition-all duration-200 hover:bg-primary hover:text-white"
                >
                    ← Back
                </button>

                {/* Main Container */}
                <div className="bg-base rounded-xl overflow-hidden shadow-md">

                    {/* Image */}
                    <div className="relative w-full h-96 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 right-4 ${labelColor} text-base px-4 py-2 rounded-full text-xs font-semibold font-quicksand uppercase tracking-wide`}>
                            {labelText}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">

                        {/* Header with Title */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-tertiary font-quicksand mb-3">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>📍 {typeof post.location === 'object' ? post.location?.place_name : post.location}</span>
                                <span>•</span>
                                <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-100 px-4 py-4 rounded-lg mb-6 border-l-4 border-label-lost">
                            <div className="font-semibold text-tertiary mb-1">
                                Posted by: @{post.user.name}
                            </div>
                            <div className="text-xs text-gray-600">
                                Member since {new Date(post.user.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Category */}
                        {post.category && (
                            <div className="mb-6">
                                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    Category
                                </div>
                                <div className="inline-block bg-primary text-white px-4 py-2 rounded-2xl text-xs font-medium font-quicksand">
                                    {post.category}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                Description
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                {post.description}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="bg-gray-100 px-4 py-3 rounded-lg mb-6 text-xs text-gray-600">
                            <span className="font-semibold mr-2">Status:</span>
                            <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase ${post.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {post.status}
                            </span>
                        </div>

                        {/* Actions - only show if user owns the post */}
                        {isOwnPost && (
                            <div className="flex gap-3 pt-6 border-t border-gray-300">
                                <button
                                    onClick={() => window.location.href = `/posts/${post.id}/edit`}
                                    className="flex-1 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-lg font-quicksand transition-all duration-200 hover:bg-secondary cursor-pointer"
                                >
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this post?')) {
                                            // TODO: implement delete
                                        }
                                    }}
                                    className="flex-1 px-5 py-3 bg-label-lost text-white text-sm font-semibold rounded-lg font-quicksand transition-all duration-200 hover:opacity-80 cursor-pointer"
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
