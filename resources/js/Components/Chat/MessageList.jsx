import React, { useEffect, useRef, useCallback } from 'react';
import MessageBubble from '@/Components/Chat/MessageBubble';
import { useTranslation } from '@/hooks/useTranslation';

export default function MessageList({ messages, loading = false, hasMore = false, onLoadMore, onRequestRating, authUserId }) {
    const { t } = useTranslation();
    const endRef = useRef(null);
    const containerRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);

    // Auto-scroll ke bawah saat pesan baru masuk (bukan saat load more)
    useEffect(() => {
        const isNewMessage = messages.length > prevMessagesLengthRef.current;
        const wasAtBottom =
            prevMessagesLengthRef.current === 0 ||
            messages.length - prevMessagesLengthRef.current <= 2;

        if (isNewMessage && wasAtBottom) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    // Initial scroll ke bawah
    useEffect(() => {
        if (messages.length > 0) {
            endRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages.length > 0 && messages[0]?.conversation_id]);

    // Scroll handler untuk load more (scroll ke atas)
    const handleScroll = useCallback(() => {
        if (!containerRef.current || loading || !hasMore) return;

        const { scrollTop } = containerRef.current;
        if (scrollTop < 100 && onLoadMore) {
            onLoadMore();
        }
    }, [loading, hasMore, onLoadMore]);

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
        >
            <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col justify-end gap-3 md:gap-4">
                {/* Load more indicator */}
                {hasMore && (
                    <div className="flex justify-center py-2">
                        <button
                            type="button"
                            onClick={onLoadMore}
                            disabled={loading}
                            className="rounded-full border border-secondary/45 bg-primary px-4 py-1.5 text-[12px] font-medium text-tertiary/70 shadow-sm transition-colors hover:bg-secondary/30 disabled:opacity-50"
                        >
                            {loading ? t('chat.loadingEllipsis') : t('chat.loadOlderMessages')}
                        </button>
                    </div>
                )}

                {/* Loading indicator */}
                {loading && messages.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-secondary border-t-tertiary" />
                    </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        onRequestRating={onRequestRating}
                        authUserId={authUserId}
                    />
                ))}

                <div ref={endRef} />
            </div>
        </div>
    );
}
