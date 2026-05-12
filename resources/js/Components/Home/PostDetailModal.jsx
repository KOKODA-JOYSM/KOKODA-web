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
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg md:rounded-2xl w-[92%] md:w-11/12 max-w-8xl md:h-[850px] z-50 shadow-2xl animate-slideUp flex flex-col md:flex-row overflow-hidden max-h-[95vh] md:max-h-none"
            >
                {/* Left Section - Image with Overlay */}
                <div className="w-full md:w-[45%] flex-shrink-0 bg-gray-100 flex flex-col relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-300">
                    {/* User Info - Top Left */}
                    <div className="absolute top-2 md:top-4 left-2 md:left-4 flex items-center gap-1.5 md:gap-2.5 bg-white bg-opacity-95 px-2 md:px-3 py-1 md:py-2 rounded-lg z-10">
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-highlight flex items-center justify-center text-xs md:text-sm flex-shrink-0">
                            {/* profile */}
                        </div>
                        <div className="min-w-0">
                            <div className="font-quicksand font-semibold text-[10px] md:text-xs text-tertiary truncate">
                                @{post.user?.name}
                            </div>
                        </div>
                    </div>

                    {/* Badge - Top Right */}
                    <div className={`absolute top-2 md:top-4 right-2 md:right-4 ${labelColor} px-2 md:px-3.5 py-1 md:py-1.5 rounded text-[10px] md:text-xs font-semibold font-quicksand z-10 whitespace-nowrap text-base`}>
                        {labelText} Item
                    </div>

                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-48 md:h-3/5 object-cover"
                    />

                    {/* Map Section */}
                    <div className="flex-1 bg-gray-300 flex items-center justify-center border-t border-gray-300 text-2xl md:text-5xl min-h-40 md:min-h-0">
                        🗺️
                    </div>

                    {/* Location Text */}
                    <div className="px-2 md:px-3 py-2 md:py-3 bg-gray-100 border-t border-gray-300 text-xs md:text-base font-quicksand text-gray-600 text-center break-words">
                        {post.location}
                    </div>
                </div>

                {/* Right Section - Details */}
                <div className="w-full md:w-[55%] p-3 md:p-7 flex flex-col relative overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 md:top-4 md:right-4 bg-none border-none text-2xl md:text-4xl cursor-pointer text-secondary hover:opacity-70 transition-opacity w-8 h-8 flex items-center justify-center flex-shrink-0"
                    >
                        ✕
                    </button>

                    {/* Title */}
                    <h2 className="text-xl md:text-5xl font-bold text-tertiary font-quicksand mb-2 md:mb-10 leading-snug pr-8 p-2 md:p-8 md:pb-0 break-words">
                        {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm md:text-3xl text-gray-600 mb-2 md:mb-5 leading-relaxed px-2 md:px-8 break-words">
                        {post.description}
                    </p>

                    {/* Category */}
                    {post.category && (
                        <div className="mb-2 md:mb-4 px-2 md:px-8">
                            <div className="text-xs md:text-2xl text-gray-500 mb-1 md:mb-2 font-quicksand uppercase tracking-wider">
                                Kategori:
                            </div>
                            <div className="inline-block bg-highlight text-tertiary px-2 md:px-3 py-0.5 md:py-1.5 rounded-lg md:rounded-2xl text-xs md:text-2xl font-semibold font-quicksand break-words">
                                {post.category}
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="text-xs md:text-xl text-gray-600 mb-2 md:mb-6 font-quicksand p-2 md:p-4 md:px-8 break-words">
                        <span className="font-semibold">Waktu Ditemukan:</span> {formattedDate}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Button */}
                    <button
                        className={`bg-secondary text-white rounded-lg px-3 md:px-5 py-2 md:py-3.5 text-xs md:text-xl font-semibold cursor-pointer font-quicksand transition-all duration-200 w-full hover:opacity-85 active:scale-95 flex-shrink-0 break-words`}
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
