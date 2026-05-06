import React from 'react';

export default function PostDetailModal({ post, onClose }) {
    const isFounded = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found' : 'bg-label-lost';
    const labelText = isFounded ? 'Found' : 'Lost';
    const buttonText = isFounded ? 'I Found This Item' : 'This is My Item';

    const imageUrl = 'public/images/default.img.webp';

    const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
            />

            {/* Modal */}
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl w-11/12 max-w-8xl h-[850px] z-50 shadow-2xl animate-slideUp flex overflow-hidden"
            >
                {/* Left Section - Image with Overlay */}
                <div className="w-[45%] flex-shrink-0 bg-gray-100 flex flex-col relative overflow-hidden border-r border-gray-300">
                    {/* User Info - Top Left */}
                    <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white bg-opacity-95 px-3 py-2 rounded-lg z-10">
                        <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-sm">
                            {/* profile */}
                        </div>
                        <div>
                            <div className="font-quicksand font-semibold text-xs text-tertiary">
                                @{post.user?.name}
                            </div>
                        </div>
                    </div>

                    {/* Badge - Top Right */}
                    <div className={`absolute top-4 right-4 ${labelColor} text-base px-3.5 py-1.5 rounded text-xs font-semibold font-quicksand z-10`}>
                        {labelText} Item
                    </div>

                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-3/5 object-cover"
                    />

                    {/* Map Section */}
                    <div className="flex-1 bg-gray-300 flex items-center justify-center border-t border-gray-300 text-5xl">
                        🗺️
                    </div>

                    {/* Location Text */}
                    <div className="px-3 py-3 bg-gray-100 border-t border-gray-300 text-base font-quicksand text-gray-600 text-center">
                        {post.location}
                    </div>
                </div>

                {/* Right Section - Details */}
                <div className="w-[55%] p-7 flex flex-col relative overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-none border-none text-4xl cursor-pointer text-secondary p-4 m-3 w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>

                    {/* Title */}
                    <h2 className="text-5xl font-bold text-tertiary font-quicksand mb-10 leading-snug pr-8 p-8 pb-0">
                        {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-3xl text-gray-600 mb-5 leading-relaxed px-8">
                        {post.description}
                    </p>

                    {/* Category */}
                    {post.category && (
                        <div className="mb-4 px-8">
                            <div className="text-2xl text-gray-500 mb-2 font-quicksand uppercase tracking-wider">
                                Kategori:
                            </div>
                            <div className="inline-block bg-highlight text-tertiary px-3 py-1.5 rounded-2xl text-2xl font-semibold font-quicksand">
                                {post.category}
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="text-xl text-gray-600 mb-6 font-quicksand p-4 px-8">
                        <span className="font-semibold">Waktu Ditemukan:</span> {formattedDate}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Button */}
                    <button
                        className={`bg-secondary text-base px-5 py-3.5 text-white rounded-lg text-xl font-semibold cursor-pointer font-quicksand transition-all duration-200 w-full hover:opacity-85`}
                    >
                        {buttonText}
                    </button>
                </div>

                {/* CSS Animations */}
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -40%);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease;
                    }
                    .animate-slideUp {
                        animation: slideUp 0.3s ease;
                    }
                `}</style>
            </div>
        </>
    );
}
