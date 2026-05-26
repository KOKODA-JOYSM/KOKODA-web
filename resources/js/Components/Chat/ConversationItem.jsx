import React from 'react';

function ConversationAvatar({ conversation }) {
    return (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-background ring-2 ring-[#F7D8B0] md:h-14 md:w-14">
            <img
                src={conversation.avatar}
                alt={conversation.name}
                className="h-full w-full object-cover"
            />
            {conversation.isOnline && (
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#F1C38B] bg-online-color" />
            )}
        </div>
    );
}

export default function ConversationItem({ conversation, active, onSelect }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(conversation)}
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200 md:gap-3.5 md:px-4 md:py-3 ${
                active
                    ? 'bg-transparent sm:bg-base text-tertiary sm:shadow-[0_10px_18px_rgba(0,0,0,0.08)]'
                    : 'bg-transparent text-tertiary/90 hover:bg-white/20'
            }`}
        >
            <ConversationAvatar conversation={conversation} />

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-quicksand text-[15px] font-semibold leading-none md:text-[17px]">
                        {conversation.name}
                    </p>
                    <span className="shrink-0 pt-0.5 text-[11px] font-semibold text-tertiary/85 md:text-[12px]">
                        {conversation.timestamp}
                    </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate font-roboto text-[12px] leading-snug text-tertiary/85 md:text-[13px]">
                        {conversation.lastMessage}
                    </p>

                    {conversation.unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1.5 text-[11px] font-bold leading-none text-base">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}
