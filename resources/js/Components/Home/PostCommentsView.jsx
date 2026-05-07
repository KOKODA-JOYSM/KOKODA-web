import React from 'react';
import { Send } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

export default function PostCommentsView({
    comments,
    newComment,
    setNewComment,
    onClose,
    onAddComment,
    imageUrl
}) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAddComment();
        }
    };

    return (
        <div className="bg-base rounded-2xl overflow-hidden flex shadow-md h-[46rem]">
            {/* Left: Image */}
            <div className="w-1/2 bg-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right: Comments Section */}
            <div className="w-1/2 flex flex-col bg-base">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary" style={{ padding: '1.25rem 2rem' }}>
                    <button
                        onClick={onClose}
                        className="bg-none border-none text-2xl cursor-pointer p-0 font-quicksand"
                    >
                        <ChevronLeft size={28}/>
                    </button>
                    <h2 className="font-quicksand text-2xl font-bold text-tertiary m-2 flex-1 text-center">
                        Comments
                    </h2>
                    <div className="w-6" />
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-8">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3"
                        >
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-highlight flex items-center justify-center text-lg flex-shrink-0">
                                {comment.avatar}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <p className="font-quicksand text-sm font-semibold text-tertiary m-0 mb-1">
                                    {comment.user}
                                </p>
                                <p className="font-quicksand text-sm text-gray-600 m-0 leading-relaxed">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Field */}
                <div className="border-t border-gray-100 flex gap-2" style={{ padding: '1rem 1.5rem' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add Comment here"
                        className="flex-1 bg-base border-primary rounded-full text-sm font-quicksand text-tertiary outline-none"
                        style={{ padding: '0.75rem 1rem' }}
                    />
                    <button
                        onClick={onAddComment}
                        className="bg-none border-none cursor-pointer transition-opacity duration-200 hover:opacity-70 flex items-center justify-center text-gray-text-field"
                        style={{ padding: '0.5rem 0.75rem' }}
                    >
                        <Send size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
}
