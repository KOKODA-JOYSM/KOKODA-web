import React, { useMemo, useState, useCallback } from 'react';
import { Search, UserPlus } from 'lucide-react';
import ConversationItem from '@/Components/Chat/ConversationItem';

export default function ConversationList({
    conversations,
    selectedId,
    onSelectConversation,
    isOpen = true,
    onSearchUsers,
    userSearchResults = [],
    searchingUsers = false,
    onStartConversation,
}) {
    const [query, setQuery] = useState('');
    const [isSearchingNewUser, setIsSearchingNewUser] = useState(false);

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery || isSearchingNewUser) {
            return isSearchingNewUser ? [] : conversations;
        }

        return conversations.filter((conversation) => {
            return (
                conversation.name.toLowerCase().includes(normalizedQuery) ||
                (conversation.lastMessage && conversation.lastMessage.toLowerCase().includes(normalizedQuery))
            );
        });
    }, [conversations, query, isSearchingNewUser]);

    const handleQueryChange = useCallback(
        (event) => {
            const value = event.target.value;
            setQuery(value);

            if (isSearchingNewUser && onSearchUsers) {
                onSearchUsers(value);
            }
        },
        [isSearchingNewUser, onSearchUsers]
    );

    const toggleNewUserSearch = useCallback(() => {
        setIsSearchingNewUser((prev) => {
            const newState = !prev;
            if (newState) {
                setQuery('');
            } else {
                setQuery('');
            }
            return newState;
        });
    }, []);

    const handleStartConversation = useCallback(
        (userId) => {
            if (onStartConversation) {
                onStartConversation(userId);
            }
            setIsSearchingNewUser(false);
            setQuery('');
        },
        [onStartConversation]
    );

    return (
        <aside
            className={`h-full w-full shrink-0 overflow-hidden border-r border-secondary/25 bg-primary transition-transform duration-300 sm:w-[320px] md:w-[340px] lg:w-[360px] ${isOpen ? 'block translate-x-0' : 'hidden sm:block sm:translate-x-0'
                }`}
        >
            <div className="flex h-full min-h-0 flex-col px-4 pt-8 pb-5 sm:pt-6 md:px-6 border-2 border-secondary">
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => document.getElementById('hamburger-btn')?.click()}
                            aria-label="Open menu"
                            className="flex lg:hidden flex-col items-center justify-center gap-1.5 p-0 bg-primary hover:bg-secondary border-none rounded-xl w-10 h-10 sm:w-11 sm:h-11 transition-colors duration-200 ease-in cursor-pointer shrink-0"
                        >
                            <span className="block w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out" />
                            <span className="block w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out" />
                            <span className="block w-6 h-0.5 bg-base rounded-sm transition-all duration-300 ease-in-out" />
                        </button>

                        <h1 className="font-quicksand text-[34px] font-bold tracking-tight text-tertiary md:text-[38px] lg:text-[40px]">
                            Messages
                        </h1>

                        <button
                            type="button"
                            onClick={toggleNewUserSearch}
                            className={`ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isSearchingNewUser
                                ? 'bg-tertiary text-base'
                                : 'bg-base text-tertiary/70 hover:bg-secondary/50'
                                }`}
                            aria-label={isSearchingNewUser ? 'Back to messages list' : 'Find a new user'}
                            title={isSearchingNewUser ? 'Back to messages list' : 'Start a new chat'}
                        >
                            <UserPlus className="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center rounded-full bg-base px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.12)]">
                        <Search className="h-5 w-5 shrink-0 text-tertiary/80" />
                        <input
                            type="text"
                            value={query}
                            onChange={handleQueryChange}
                            placeholder={isSearchingNewUser ? 'Find a new user...' : 'Search'}
                            className="ml-3 w-full border-0 bg-transparent p-0 font-roboto text-[16px] text-tertiary placeholder:text-tertiary/80 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 no-scrollbar md:mt-6">
                    {isSearchingNewUser ? (
                        // Mode pencarian user baru
                        <div className="space-y-1">
                            {searchingUsers && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-tertiary" />
                                </div>
                            )}

                            {!searchingUsers && query.length >= 2 && userSearchResults.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="font-roboto text-sm text-tertiary/60">
                                        User Not Found
                                    </p>
                                </div>
                            )}

                            {!searchingUsers && query.length < 2 && (
                                <div className="py-8 text-center">
                                    <p className="font-roboto text-sm text-tertiary/60">
                                        Type at least 2 characters to search
                                    </p>
                                </div>
                            )}

                            {userSearchResults.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleStartConversation(user.id)}
                                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-white/20"
                                >
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-background ring-2 ring-[#F7D8B0]">
                                        <img
                                            src={
                                                user.profile_icon
                                                    ? user.profile_icon.startsWith('/')
                                                        ? user.profile_icon
                                                        : `/images/profile-icons/${user.profile_icon}`
                                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
                                            }
                                            alt={user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-quicksand text-[15px] font-semibold text-tertiary">
                                            {user.name}
                                        </p>
                                        {user.username && (
                                            <p className="truncate font-quicksand text-[14px] font-medium text-tertiary/60">
                                                @{user.username}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Mode daftar conversation normal
                        <div className="divide-y divide-secondary/25">
                            {conversations.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="font-roboto text-sm text-tertiary/60">
                                        No conversations yet
                                    </p>
                                    <p className="mt-1 font-roboto text-xs text-tertiary/40">
                                        Click <UserPlus className="inline h-3.5 w-3.5" /> to start a new chat
                                    </p>
                                </div>
                            )}

                            {filteredConversations.map((conversation) => (
                                <div key={conversation.id} className="py-2.5 md:py-3">
                                    <ConversationItem
                                        conversation={conversation}
                                        active={selectedId === conversation.id}
                                        onSelect={onSelectConversation}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
