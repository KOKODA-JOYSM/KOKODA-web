import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ChatHeader({ conversation, onShowConversations, typingUsers = [] }) {
    const isTyping = typingUsers.length > 0;

    return (
        <div className="flex shrink-0 items-center justify-between border-b border-secondary/35 bg-[#FBF4E8] px-4 py-3 md:px-6 md:py-4">
            <div className="flex min-w-0 items-center gap-3 pb-2 pt-4">
                <button
                    type="button"
                    onClick={onShowConversations}
                    className="inline-flex h-10 w-10 mr-2 items-center justify-center rounded-full bg-primary text-base shadow-sm sm:hidden"
                    aria-label="Show conversations"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-base ring-2 ring-[#F7D8B0] md:h-12 md:w-12">
                    <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="h-full w-full object-cover"
                    />
                    {conversation.isOnline && (
                        <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#FBF4E8] bg-online-color" />
                    )}
                </div>

                <div className="min-w-0">
                    <h2 className="truncate font-quicksand text-[17px] font-bold leading-tight text-tertiary md:text-[20px] lg:text-[21px]">
                        {conversation.name}
                    </h2>
                    <p className="flex items-center gap-1 text-[11px] text-tertiary/65 md:text-[12px]">
                        {isTyping ? (
                            <span className="flex items-center gap-1 text-tertiary/80">
                                <span className="inline-flex gap-[2px]">
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-tertiary/60" style={{ animationDelay: '0ms' }} />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-tertiary/60" style={{ animationDelay: '150ms' }} />
                                    <span className="h-1 w-1 animate-bounce rounded-full bg-tertiary/60" style={{ animationDelay: '300ms' }} />
                                </span>
                                <span className="ml-0.5">
                                    {typingUsers.length === 1
                                        ? `${typingUsers[0]} sedang mengetik`
                                        : `${typingUsers.join(', ')} sedang mengetik`}
                                </span>
                            </span>
                        ) : conversation.isOnline ? (
                            <>
                                <span className="text-online-color">●</span>
                                <span>Online now</span>
                            </>
                        ) : (
                            <span className="text-tertiary/45">Offline</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
