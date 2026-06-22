import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ConversationList from '@/Components/Chat/ConversationList';
import ChatHeader from '@/Components/Chat/ChatHeader';
import MessageList from '@/Components/Chat/MessageList';
import MessageInput from '@/Components/Chat/MessageInput';
import { useEcho, createTypingThrottle } from '@/hooks/useEcho';

/**
 * Format timestamp ISO ke jam:menit lokal (id-ID).
 */
function formatTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format timestamp ke label relatif (Hari ini / Kemarin / tanggal).
 */
function formatDateLabel(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Tambahkan day dividers ke antara pesan-pesan.
 */
function addDayDividers(messages) {
    const result = [];
    let lastDate = null;

    for (const msg of messages) {
        const msgDate = new Date(msg.created_at).toDateString();
        if (msgDate !== lastDate) {
            result.push({
                id: `divider-${msgDate}`,
                type: 'day-divider',
                label: formatDateLabel(msg.created_at),
            });
            lastDate = msgDate;
        }
        result.push(msg);
    }

    return result;
}

/**
 * Generate avatar URL berdasarkan profile icon atau fallback ke DiceBear.
 */
function getAvatarUrl(user) {
    if (!user) return '';
    if (user.profile_icon) {
        // Jika profile_icon adalah path relatif
        if (user.profile_icon.startsWith('/') || user.profile_icon.startsWith('http')) {
            return user.profile_icon;
        }
        return `/images/profile-icons/${user.profile_icon}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'user')}`;
}

export default function ChatPage({ initialConversations = [], targetUserId = null }) {
    const { auth } = usePage().props;
    const authUser = auth.user;

    // State
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [draftMessage, setDraftMessage] = useState('');
    const [showConversationList, setShowConversationList] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState({});
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [sendingMessage, setSendingMessage] = useState(false);

    // Refs
    const typingThrottleRef = useRef(null);
    const currentConversationIdRef = useRef(null);

    // Echo hooks
    const {
        subscribeToConversation,
        leaveConversation,
        subscribeToUserChannel,
        joinPresenceChannel,
        leavePresenceChannel,
    } = useEcho();

    // ─────────────────────────────────────────────────────────────
    // INITIAL SETUP
    // ─────────────────────────────────────────────────────────────

    // Subscribe ke user channel & presence channel saat pertama kali mount
    useEffect(() => {
        if (!authUser) return;

        // Subscribe ke user channel untuk conversation updates
        subscribeToUserChannel(authUser.id, {
            onConversationUpdated: (event) => {
                setConversations((prev) => {
                    const idx = prev.findIndex((c) => c.id === event.conversation_id);
                    if (idx === -1) {
                        // Conversation baru — refresh daftar
                        refreshConversations();
                        return prev;
                    }

                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        last_message: event.last_message,
                        // Tambah unread count jika bukan conversation yang sedang dibuka
                        unread_count:
                            currentConversationIdRef.current === event.conversation_id
                                ? 0
                                : (updated[idx].unread_count || 0) + 1,
                    };

                    // Reorder: conversation dengan pesan terbaru di atas
                    updated.sort((a, b) => {
                        const aTime = a.last_message?.created_at || a.created_at;
                        const bTime = b.last_message?.created_at || b.created_at;
                        return new Date(bTime) - new Date(aTime);
                    });

                    return updated;
                });
            },
        });

        // Join presence channel untuk online status
        joinPresenceChannel({
            onHere: (users) => {
                setOnlineUserIds(new Set(users.map((u) => u.id)));
            },
            onJoining: (user) => {
                setOnlineUserIds((prev) => new Set([...prev, user.id]));
            },
            onLeaving: (user) => {
                setOnlineUserIds((prev) => {
                    const next = new Set(prev);
                    next.delete(user.id);
                    return next;
                });
            },
        });

        return () => {
            leavePresenceChannel();
        };
    }, [authUser?.id]);

    // Auto-start conversation jika targetUserId disediakan (dari query param)
    useEffect(() => {
        if (targetUserId && authUser) {
            handleStartConversation(parseInt(targetUserId, 10));
        }
    }, [targetUserId, authUser]);

    // Auto-select pertama jika ada conversations dan belum ada yang dipilih
    useEffect(() => {
        if (conversations.length > 0 && !selectedConversation && !targetUserId) {
            handleSelectConversation(conversations[0]);
        }
    }, [conversations]);

    // ─────────────────────────────────────────────────────────────
    // POLLING FALLBACK
    // Keeps chat live even where WebSockets aren't available (Azure prod
    // has no Reverb server). Echo (when it works locally) still delivers
    // instantly; merge-by-id below means no duplicates when both run.
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!authUser) return;

        const intervalId = setInterval(() => {
            // Refresh conversation list (unread counts, ordering, new chats)
            refreshConversations();

            // Pull new messages for the open conversation and append only ids
            // we don't already have (skips optimistic "temp-" messages).
            const conversationId = currentConversationIdRef.current;
            if (!conversationId) return;

            window.axios
                .get(`/chat/conversations/${conversationId}/messages`)
                .then((response) => {
                    const fetched = response.data.messages.map(transformMessage);
                    let appended = false;

                    setMessages((prev) => {
                        const existingIds = new Set(
                            prev
                                .filter((m) => !String(m.id).startsWith('temp-'))
                                .map((m) => m.id)
                        );
                        const newOnes = fetched.filter((m) => !existingIds.has(m.id));
                        if (newOnes.length === 0) return prev;
                        appended = true;
                        return [...prev, ...newOnes];
                    });

                    // If new messages arrived while viewing, mark them read
                    if (appended) markAsRead(conversationId);
                })
                .catch(() => {});
        }, 3500);

        return () => clearInterval(intervalId);
    }, [authUser?.id]);

    // ─────────────────────────────────────────────────────────────
    // CONVERSATION SELECTION & MESSAGES
    // ─────────────────────────────────────────────────────────────

    const handleSelectConversation = useCallback(
        async (conversation) => {
            // Leave previous conversation channel
            if (currentConversationIdRef.current) {
                leaveConversation(currentConversationIdRef.current);
            }

            setSelectedConversation(conversation);
            currentConversationIdRef.current = conversation.id;
            setShowConversationList(false);
            setDraftMessage('');
            setTypingUsers({});

            // Fetch messages
            await fetchMessages(conversation.id);

            // Mark as read
            markAsRead(conversation.id);

            // Subscribe ke conversation channel
            subscribeToConversation(conversation.id, {
                onMessageSent: (event) => {
                    setMessages((prev) => [...prev, transformMessage(event.message)]);

                    // Mark as read karena user sedang membuka conversation ini
                    markAsRead(conversation.id);
                },
                onTyping: (event) => {
                    if (event.user_id !== authUser.id) {
                        setTypingUsers((prev) => ({
                            ...prev,
                            [event.user_id]: event.is_typing ? event.user_name : null,
                        }));

                        // Auto-clear typing after 3 seconds
                        if (event.is_typing) {
                            setTimeout(() => {
                                setTypingUsers((prev) => {
                                    const next = { ...prev };
                                    delete next[event.user_id];
                                    return next;
                                });
                            }, 3000);
                        }
                    }
                },
                onMessagesRead: (event) => {
                    // Bisa digunakan untuk menampilkan read receipt di UI
                },
            });

            // Setup typing throttle untuk conversation ini
            typingThrottleRef.current = createTypingThrottle((isTyping) => {
                window.axios.post(`/chat/conversations/${conversation.id}/typing`, {
                    is_typing: isTyping,
                }).catch(() => {}); // Ignore errors untuk typing
            }, 2000);

            // Update unread count di conversation list
            setConversations((prev) =>
                prev.map((c) => (c.id === conversation.id ? { ...c, unread_count: 0 } : c))
            );
        },
        [authUser?.id]
    );

    const fetchMessages = async (conversationId, before = null) => {
        setLoadingMessages(true);
        try {
            const params = before ? `?before=${before}` : '';
            const response = await window.axios.get(
                `/chat/conversations/${conversationId}/messages${params}`
            );

            const newMessages = response.data.messages.map(transformMessage);

            if (before) {
                setMessages((prev) => [...newMessages, ...prev]);
            } else {
                setMessages(newMessages);
            }

            setHasMoreMessages(response.data.has_more);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleLoadMore = useCallback(() => {
        if (loadingMessages || !hasMoreMessages || messages.length === 0) return;
        fetchMessages(currentConversationIdRef.current, messages[0]?.id);
    }, [loadingMessages, hasMoreMessages, messages]);

    // ─────────────────────────────────────────────────────────────
    // SEND MESSAGE
    // ─────────────────────────────────────────────────────────────

    const handleSendMessage = useCallback(async () => {
        const trimmedMessage = draftMessage.trim();
        if (!trimmedMessage || !selectedConversation || sendingMessage) return;

        // Stop typing indicator
        typingThrottleRef.current?.stop();

        // Optimistic update: tambahkan pesan ke UI langsung
        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            conversation_id: selectedConversation.id,
            user_id: authUser.id,
            body: trimmedMessage,
            type: 'text',
            is_own: true,
            created_at: new Date().toISOString(),
            sender: {
                id: authUser.id,
                name: authUser.name,
                username: authUser.username,
                profile_icon: authUser.profile_icon,
            },
            _sending: true,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setDraftMessage('');
        setSendingMessage(true);

        try {
            const response = await window.axios.post(
                `/chat/conversations/${selectedConversation.id}/messages`,
                { body: trimmedMessage, type: 'text' }
            );

            // Replace optimistic message dengan real message dari server
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === optimisticMessage.id ? transformMessage(response.data.message) : msg
                )
            );

            // Update conversation list
            setConversations((prev) => {
                const updated = prev.map((c) =>
                    c.id === selectedConversation.id
                        ? {
                              ...c,
                              last_message: {
                                  id: response.data.message.id,
                                  body: response.data.message.body,
                                  type: response.data.message.type,
                                  sender_id: authUser.id,
                                  sender_name: authUser.name,
                                  created_at: response.data.message.created_at,
                              },
                          }
                        : c
                );

                updated.sort((a, b) => {
                    const aTime = a.last_message?.created_at || a.created_at;
                    const bTime = b.last_message?.created_at || b.created_at;
                    return new Date(bTime) - new Date(aTime);
                });

                return updated;
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            // Remove optimistic message on failure
            setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
            setDraftMessage(trimmedMessage); // Restore draft
        } finally {
            setSendingMessage(false);
        }
    }, [draftMessage, selectedConversation, authUser, sendingMessage]);

    // ─────────────────────────────────────────────────────────────
    // TYPING INDICATOR
    // ─────────────────────────────────────────────────────────────

    const handleDraftChange = useCallback(
        (value) => {
            setDraftMessage(value);
            if (value.trim()) {
                typingThrottleRef.current?.trigger();
            } else {
                typingThrottleRef.current?.stop();
            }
        },
        []
    );

    // ─────────────────────────────────────────────────────────────
    // START NEW CONVERSATION
    // ─────────────────────────────────────────────────────────────

    const handleStartConversation = async (userId) => {
        try {
            const response = await window.axios.post('/chat/conversations', {
                user_id: userId,
            });

            const newConversation = response.data.conversation;

            // Cek apakah conversation sudah ada di list
            setConversations((prev) => {
                const existing = prev.find((c) => c.id === newConversation.id);
                if (existing) return prev;
                return [newConversation, ...prev];
            });

            // Select conversation baru
            handleSelectConversation(newConversation);
            setUserSearchResults([]);
        } catch (error) {
            console.error('Failed to start conversation:', error);
        }
    };

    const handleSearchUsers = async (query) => {
        if (query.length < 2) {
            setUserSearchResults([]);
            return;
        }

        setSearchingUsers(true);
        try {
            const response = await window.axios.get(`/chat/users/search?q=${encodeURIComponent(query)}`);
            setUserSearchResults(response.data);
        } catch (error) {
            console.error('Failed to search users:', error);
        } finally {
            setSearchingUsers(false);
        }
    };

    // ─────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────

    const refreshConversations = async () => {
        try {
            const response = await window.axios.get('/chat/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Failed to refresh conversations:', error);
        }
    };

    const markAsRead = (conversationId) => {
        window.axios
            .post(`/chat/conversations/${conversationId}/read`)
            .catch(() => {});
    };

    function transformMessage(msg) {
        return {
            id: msg.id,
            conversation_id: msg.conversation_id,
            user_id: msg.user_id,
            senderId: msg.user_id,
            senderName: msg.sender?.name || 'Unknown',
            senderAvatar: getAvatarUrl(msg.sender),
            body: msg.body,
            text: msg.body,
            type: msg.type || 'text',
            timestamp: formatTime(msg.created_at),
            created_at: msg.created_at,
            isOwn: msg.is_own ?? msg.user_id === authUser?.id,
            sender: msg.sender,
        };
    }

    // Transform conversations untuk komponen ConversationList
    const transformedConversations = conversations.map((conv) => ({
        id: conv.id,
        name: conv.other_user?.name || 'Unknown User',
        avatar: getAvatarUrl(conv.other_user),
        lastMessage: conv.last_message
            ? conv.last_message.body.length > 35
                ? conv.last_message.body.substring(0, 35) + '...'
                : conv.last_message.body
            : 'Belum ada pesan',
        timestamp: conv.last_message
            ? formatTime(conv.last_message.created_at)
            : '',
        unreadCount: conv.unread_count || 0,
        isOnline: conv.other_user ? onlineUserIds.has(conv.other_user.id) : false,
        otherUser: conv.other_user,
        _raw: conv,
    }));

    // Get selected conversation transformed
    const selectedTransformed = selectedConversation
        ? transformedConversations.find((c) => c.id === selectedConversation.id)
        : null;

    // Get typing users for current conversation
    const currentTyping = Object.entries(typingUsers)
        .filter(([, name]) => name)
        .map(([, name]) => name);

    // Messages with day dividers
    const messagesWithDividers = addDayDividers(messages);

    return (
        <AppLayout title="Chat - KOKODA">
            <div className="h-screen w-full overflow-hidden bg-background sm:pt-0">
                <div className="flex h-full min-h-0 flex-col overflow-hidden sm:flex-row md:flex-row">
                    <ConversationList
                        conversations={transformedConversations}
                        selectedId={selectedConversation?.id}
                        onSelectConversation={(conv) => {
                            const rawConv = conversations.find((c) => c.id === conv.id);
                            if (rawConv) handleSelectConversation(rawConv);
                        }}
                        isOpen={showConversationList}
                        onSearchUsers={handleSearchUsers}
                        userSearchResults={userSearchResults}
                        searchingUsers={searchingUsers}
                        onStartConversation={handleStartConversation}
                    />

                    <section
                        className={`relative min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#FBF4E8] ${
                            showConversationList ? 'hidden sm:flex' : 'flex'
                        }`}
                    >
                        {selectedTransformed ? (
                            <>
                                <ChatHeader
                                    conversation={selectedTransformed}
                                    onShowConversations={() =>
                                        setShowConversationList((current) => !current)
                                    }
                                    typingUsers={currentTyping}
                                />

                                <MessageList
                                    messages={messagesWithDividers}
                                    loading={loadingMessages}
                                    hasMore={hasMoreMessages}
                                    onLoadMore={handleLoadMore}
                                />

                                <MessageInput
                                    value={draftMessage}
                                    onChange={handleDraftChange}
                                    onSend={handleSendMessage}
                                    disabled={sendingMessage}
                                />
                            </>
                        ) : (
                            <div className="flex flex-1 items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/50">
                                        <svg
                                            className="h-10 w-10 text-tertiary/40"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="font-quicksand text-lg font-semibold text-tertiary/60">
                                        Pilih percakapan untuk mulai chat
                                    </p>
                                    <p className="mt-1 font-roboto text-sm text-tertiary/40">
                                        atau cari user baru di daftar chat
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
