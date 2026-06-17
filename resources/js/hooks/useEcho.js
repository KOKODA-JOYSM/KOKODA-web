import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook untuk manage Laravel Echo WebSocket subscriptions.
 *
 * Menyediakan methods untuk:
 * - Subscribe ke conversation channel (private)
 * - Subscribe ke user channel (private) 
 * - Join presence channel (online status)
 * - Cleanup otomatis saat component unmount
 */
export function useEcho() {
    const channelsRef = useRef(new Set());

    /**
     * Subscribe ke private conversation channel.
     * Listener: MessageSent, UserTyping, MessagesRead
     */
    const subscribeToConversation = useCallback((conversationId, handlers = {}) => {
        if (!window.Echo || !conversationId) return null;

        const channelName = `conversation.${conversationId}`;
        channelsRef.current.add(channelName);

        const channel = window.Echo.private(channelName);

        if (handlers.onMessageSent) {
            channel.listen('.message.sent', handlers.onMessageSent);
        }

        if (handlers.onTyping) {
            channel.listen('.user.typing', handlers.onTyping);
        }

        if (handlers.onMessagesRead) {
            channel.listen('.messages.read', handlers.onMessagesRead);
        }

        return channel;
    }, []);

    /**
     * Unsubscribe dari conversation channel.
     */
    const leaveConversation = useCallback((conversationId) => {
        if (!window.Echo || !conversationId) return;

        const channelName = `conversation.${conversationId}`;
        window.Echo.leave(channelName);
        channelsRef.current.delete(channelName);
    }, []);

    /**
     * Subscribe ke private user channel.
     * Listener: ConversationUpdated
     */
    const subscribeToUserChannel = useCallback((userId, handlers = {}) => {
        if (!window.Echo || !userId) return null;

        const channelName = `user.${userId}`;
        channelsRef.current.add(channelName);

        const channel = window.Echo.private(channelName);

        if (handlers.onConversationUpdated) {
            channel.listen('.conversation.updated', handlers.onConversationUpdated);
        }

        return channel;
    }, []);

    /**
     * Join presence channel untuk online status.
     * Returns channel object untuk listen ke here/joining/leaving events.
     */
    const joinPresenceChannel = useCallback((handlers = {}) => {
        if (!window.Echo) return null;

        const channelName = 'chat.online';
        channelsRef.current.add(channelName);

        const channel = window.Echo.join(channelName);

        if (handlers.onHere) {
            channel.here(handlers.onHere);
        }

        if (handlers.onJoining) {
            channel.joining(handlers.onJoining);
        }

        if (handlers.onLeaving) {
            channel.leaving(handlers.onLeaving);
        }

        return channel;
    }, []);

    /**
     * Leave presence channel.
     */
    const leavePresenceChannel = useCallback(() => {
        if (!window.Echo) return;
        window.Echo.leave('chat.online');
        channelsRef.current.delete('chat.online');
    }, []);

    /**
     * Cleanup: leave semua channel saat component unmount.
     */
    useEffect(() => {
        return () => {
            if (window.Echo) {
                channelsRef.current.forEach((channelName) => {
                    window.Echo.leave(channelName);
                });
                channelsRef.current.clear();
            }
        };
    }, []);

    return {
        subscribeToConversation,
        leaveConversation,
        subscribeToUserChannel,
        joinPresenceChannel,
        leavePresenceChannel,
    };
}

/**
 * Helper: Throttle function untuk typing indicator.
 * Membatasi frekuensi API call agar tidak spam server.
 */
export function createTypingThrottle(callback, delay = 2000) {
    let lastCall = 0;
    let timeoutId = null;

    return {
        trigger: () => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(true);
            }

            // Reset stop-typing setelah delay
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback(false);
            }, delay);
        },
        stop: () => {
            clearTimeout(timeoutId);
            callback(false);
        },
    };
}
