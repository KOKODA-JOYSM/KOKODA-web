import React from 'react';
import { Send, ChevronLeft } from 'lucide-react';

export default function PostCommentsView({
    comments,
    newComment,
    setNewComment,
    onClose,
    onAddComment,
    imageUrl,
}) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onAddComment();
    };

    return (
        <div className="bg-base rounded-2xl overflow-hidden shadow-md w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary">
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition"
                >
                    <ChevronLeft size={22} />
                </button>
                <h2 className="font-quicksand text-base font-bold text-tertiary flex-1 text-center">
                    Comments
                </h2>
                <div className="w-8" />
            </div>

            {/* Image (compact strip) */}
            <div className="w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '200px' }}>
                <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-4 p-4 max-h-72 overflow-y-auto">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-highlight flex items-center justify-center text-base flex-shrink-0">
                            {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-quicksand text-sm font-semibold text-tertiary mb-0.5">
                                {comment.user}
                            </p>
                            <p className="font-quicksand text-sm text-gray-600 leading-relaxed break-words">
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 flex gap-2 px-4 py-3">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    className="flex-1 bg-background border border-primary rounded-full text-sm font-quicksand text-tertiary outline-none px-4 py-2"
                />
                <button
                    onClick={onAddComment}
                    className="flex items-center justify-center text-gray-text-field hover:text-secondary transition-colors px-2"
                >
                    <Send size={22} />
                </button>
            </div>
        </div>
    );
}
