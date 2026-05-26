import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ConversationItem from '@/Components/Chat/ConversationItem';

export default function ConversationList({ conversations, selectedId, onSelectConversation, isOpen = true }) {
    const [query, setQuery] = useState('');

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return conversations;
        }

        return conversations.filter((conversation) => {
            return (
                conversation.name.toLowerCase().includes(normalizedQuery) ||
                conversation.lastMessage.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [conversations, query]);

    return (
        <aside
            className={`h-full w-full shrink-0 overflow-hidden border-r border-secondary/25 bg-primary transition-transform duration-300 sm:w-[320px] md:w-[340px] lg:w-[360px] ${
                isOpen ? 'block translate-x-0' : 'hidden sm:block sm:translate-x-0'
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
                    </div>

                    <div className="mt-4 flex items-center rounded-full bg-base px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.12)]">
                        <Search className="h-5 w-5 shrink-0 text-tertiary/80" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search"
                            className="ml-3 w-full border-0 bg-transparent p-0 font-roboto text-[16px] text-tertiary placeholder:text-tertiary/80 focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 no-scrollbar md:mt-6">
                    <div className="divide-y divide-secondary/25">
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
                </div>
            </div>
        </aside>
    );
}
