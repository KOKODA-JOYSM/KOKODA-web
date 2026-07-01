import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ConversationList from '@/Components/Chat/ConversationList';
import ChatHeader from '@/Components/Chat/ChatHeader';
import MessageList from '@/Components/Chat/MessageList';
import MessageInput from '@/Components/Chat/MessageInput';
import { useEcho, createTypingThrottle } from '@/hooks/useEcho';
import { avatarUrl } from '@/Components/Common/Avatar';
import RateUserModal from '@/Pages/Profile/RateUserModal';
import { useTranslation } from '@/hooks/useTranslation';

// Maps the app's dictionary locale to a BCP-47 tag for Intl date formatting.
const LOCALE_TAGS = { en: 'en-US', id: 'id-ID', ja: 'ja-JP' };

/**
 * Format timestamp ISO ke jam:menit sesuai locale aktif.
 */
function formatTime(isoString, localeTag = 'en-US') {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString(localeTag, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format timestamp ke label relatif (Hari ini / Kemarin / tanggal), sesuai locale aktif.
 */
function formatDateLabel(isoString, localeTag = 'en-US', labels = { today: 'Today', yesterday: 'Yesterday' }) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return labels.today;
    if (date.toDateString() === yesterday.toDateString()) return labels.yesterday;

    return date.toLocaleDateString(localeTag, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Tambahkan day dividers ke antara pesan-pesan.
 */
function addDayDividers(messages, localeTag, labels) {
    const result = [];
    let lastDate = null;

    for (const msg of messages) {
        const msgDate = new Date(msg.created_at).toDateString();
        if (msgDate !== lastDate) {
            result.push({
                id: `divider-${msgDate}`,
                type: 'day-divider',
                label: formatDateLabel(msg.created_at, localeTag, labels),
            });
            lastDate = msgDate;
        }
        result.push(msg);
    }

    return result;
}

/**
 * Generate avatar URL berdasarkan profile icon atau fallback ke ui-avatars.
 * Uses the shared avatarUrl() helper from Avatar.jsx for consistent URL
 * generation, with a generated fallback when no icon is set.
 */
function getAvatarUrl(user) {
    if (!user) return '';
    const url = avatarUrl(user);
    if (url) return url;
    // Fallback: generated avatar from user name
    const name = user.name || user.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4C799&color=311A05`;
}

export default function ChatPage({ initialConversations = [], targetUserId = null }) {
    const { auth } = usePage().props;
    const authUser = auth.user;
    const { locale, t } = useTranslation();
    const localeTag = LOCALE_TAGS[locale] || 'en-US';
    const dateLabels = { today: t('chat.today'), yesterday: t('chat.yesterday') };

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
    const [otherLastReadAt, setOtherLastReadAt] = useState(null);
    const [ratingClaim, setRatingClaim] = useState(null);

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
                .get(`/chat/conversations/${conversationId}/messages?_t=${Date.now()}`)
                .then((response) => {
                    const fetched = response.data.messages.map(transformMessage);
                    let appended = false;

                    // Update read receipts from polling
                    const polledReadAt = response.data.other_last_read_at;
                    if (polledReadAt) {
                        setOtherLastReadAt(polledReadAt);
                    }

                    setMessages((prev) => {
                        // Build a set of real (non-temp) IDs already present
                        const existingIds = new Set(
                            prev
                                .filter((m) => !String(m.id).startsWith('temp-'))
                                .map((m) => m.id)
                        );
                        const newOnes = fetched.filter((m) => !existingIds.has(m.id));

                        // Even if no new messages, update isRead on existing own messages
                        if (polledReadAt) {
                            const updated = prev.map((m) => {
                                if (m.isOwn && !m.isRead && m.created_at && m.created_at <= polledReadAt) {
                                    return { ...m, isRead: true };
                                }
                                return m;
                            });
                            if (newOnes.length === 0) return updated;
                            // Continue below with updated as base
                            appended = true;

                            const newById = new Map(newOnes.map((nm) => [nm.id, nm]));
                            let replaced = new Set();
                            const merged = updated.map((m) => {
                                if (!String(m.id).startsWith('temp-')) return m;
                                for (const [id, serverMsg] of newById) {
                                    if (!replaced.has(id) && serverMsg.user_id === m.user_id && serverMsg.body === m.body) {
                                        replaced.add(id);
                                        return serverMsg;
                                    }
                                }
                                return m;
                            });
                            const remaining = newOnes.filter((nm) => !replaced.has(nm.id));
                            if (remaining.length === 0 && replaced.size > 0) return merged;
                            return [...merged, ...remaining];
                        }

                        if (newOnes.length === 0) return prev;
                        appended = true;

                        // Build a lookup from the new server messages
                        const newById = new Map(newOnes.map((m) => [m.id, m]));

                        // Replace optimistic temp- messages that now have a
                        // matching server message (same user_id + body)
                        let replaced = new Set();
                        const merged = prev.map((m) => {
                            if (!String(m.id).startsWith('temp-')) return m;
                            // Find a server message that matches this temp message
                            for (const [id, serverMsg] of newById) {
                                if (!replaced.has(id) && serverMsg.user_id === m.user_id && serverMsg.body === m.body) {
                                    replaced.add(id);
                                    return serverMsg;
                                }
                            }
                            return m;
                        });

                        // Append any truly new messages that weren't used as replacements
                        const remaining = newOnes.filter((m) => !replaced.has(m.id));
                        if (remaining.length === 0 && replaced.size > 0) return merged;
                        return [...merged, ...remaining];
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
                    // Skip messages sent by the current user — they are
                    // already handled by the optimistic update + HTTP
                    // response replacement, so adding them again here
                    // would cause a brief left-side flicker / duplicate.
                    if (event.message.user_id === authUser.id) return;

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
                    // Update otherLastReadAt when the other user reads messages.
                    // This enables real-time read receipt (blue double-check) updates.
                    if (event.user_id !== authUser.id && event.read_at) {
                        setOtherLastReadAt(event.read_at);
                        // Mark all own messages as read up to read_at
                        setMessages((prev) =>
                            prev.map((m) => {
                                if (m.isOwn && !m.isRead && m.created_at && m.created_at <= event.read_at) {
                                    return { ...m, isRead: true };
                                }
                                return m;
                            })
                        );
                    }
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

            // Store the other participant's last_read_at for read receipts
            if (response.data.other_last_read_at) {
                setOtherLastReadAt(response.data.other_last_read_at);
            }
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
        // IMPORTANT: We must run this through transformMessage() so that
        // the camelCase field `isOwn` is set correctly. Without this,
        // MessageBubble sees `isOwn` as undefined → renders on the LEFT
        // briefly before the server response replaces it on the RIGHT.
        const rawOptimistic = {
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
        };
        const optimisticMessage = {
            ...transformMessage(rawOptimistic),
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
    // SEND IMAGE
    // ─────────────────────────────────────────────────────────────

    const handleSendImage = useCallback(async (file, caption = '') => {
        if (!file || !selectedConversation || sendingMessage) return;

        // Stop typing indicator
        typingThrottleRef.current?.stop();

        // Optimistic update: show preview via blob URL
        const blobUrl = URL.createObjectURL(file);
        const rawOptimistic = {
            id: `temp-${Date.now()}`,
            conversation_id: selectedConversation.id,
            user_id: authUser.id,
            body: caption || '📷 Image',
            type: 'image',
            image_url: blobUrl,
            is_own: true,
            created_at: new Date().toISOString(),
            sender: {
                id: authUser.id,
                name: authUser.name,
                username: authUser.username,
                profile_icon: authUser.profile_icon,
            },
        };
        const optimisticMessage = {
            ...transformMessage(rawOptimistic),
            _sending: true,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setSendingMessage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            if (caption) {
                formData.append('caption', caption);
            }

            const response = await window.axios.post(
                `/chat/conversations/${selectedConversation.id}/image`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            // Replace optimistic message with real message from server
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === optimisticMessage.id ? transformMessage(response.data.message) : msg
                )
            );

            // Revoke blob URL
            URL.revokeObjectURL(blobUrl);

            // Update conversation list
            setConversations((prev) => {
                const updated = prev.map((c) =>
                    c.id === selectedConversation.id
                        ? {
                              ...c,
                              last_message: {
                                  id: response.data.message.id,
                                  body: response.data.message.body,
                                  type: 'image',
                                  image_url: response.data.message.image_url,
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
            console.error('Failed to send image:', error);
            // Remove optimistic message on failure
            setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
            URL.revokeObjectURL(blobUrl);

            // Show user-friendly error
            const errorMsg = error.response?.data?.errors?.image?.[0]
                || error.response?.data?.message
                || 'Gagal mengirim gambar. Coba lagi.';
            alert(errorMsg);
        } finally {
            setSendingMessage(false);
        }
    }, [selectedConversation, authUser, sendingMessage]);

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

    const refreshConversations = useCallback(() => {
        if (!authUser) return;
        window.axios
            .get(`/chat/conversations?_t=${Date.now()}`)
            .then((res) => {
                setConversations(res.data);
            })
            .catch((error) => {
                console.error('Failed to refresh conversations:', error);
            });
    }, [authUser]);

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
            meta: msg.meta || null,
            image_url: msg.image_url || null,
            timestamp: formatTime(msg.created_at, localeTag),
            created_at: msg.created_at,
            isOwn: msg.is_own ?? msg.user_id === authUser?.id,
            isRead: msg.is_read ?? false,
            sender: msg.sender,
        };
    }

    // Transform conversations untuk komponen ConversationList
    const transformedConversations = conversations.map((conv) => {
        let lastMessage = 'Belum ada pesan';
        if (conv.last_message) {
            if (conv.last_message.type === 'image') {
                const body = conv.last_message.body;
                lastMessage = body && body !== '📷 Image' ? `📷 ${body}` : '📷 Image';
                if (lastMessage.length > 35) lastMessage = lastMessage.substring(0, 35) + '...';
            } else if (conv.last_message.body?.length > 35) {
                lastMessage = conv.last_message.body.substring(0, 35) + '...';
            } else {
                lastMessage = conv.last_message.body;
            }
        }

        return {
            id: conv.id,
            name: conv.other_user?.name || 'Unknown User',
            avatar: getAvatarUrl(conv.other_user),
            lastMessage,
            timestamp: conv.last_message
                ? formatTime(conv.last_message.created_at, localeTag)
                : '',
            unreadCount: conv.unread_count || 0,
            isOnline: conv.other_user ? onlineUserIds.has(conv.other_user.id) : false,
            otherUser: conv.other_user,
            _raw: conv,
        };
    });

    // Get selected conversation transformed
    const selectedTransformed = selectedConversation
        ? transformedConversations.find((c) => c.id === selectedConversation.id)
        : null;

    // Get typing users for current conversation
    const currentTyping = Object.entries(typingUsers)
        .filter(([, name]) => name)
        .map(([, name]) => name);

    // Messages with day dividers
    const messagesWithDividers = addDayDividers(messages, localeTag, dateLabels);

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
                                    onRequestRating={setRatingClaim}
                                    authUserId={authUser?.id}
                                />

                                <MessageInput
                                    value={draftMessage}
                                    onChange={handleDraftChange}
                                    onSend={handleSendMessage}
                                    onSendImage={handleSendImage}
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
                                        Select a conversation to start chatting
                                    </p>
                                    <p className="mt-1 font-roboto text-sm text-tertiary/40">
                                        or search for a new user in the chat list
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {ratingClaim && (
                <RateUserModal
                    claim={ratingClaim}
                    onClose={() => setRatingClaim(null)}
                />
            )}
        </AppLayout>
    );
}
