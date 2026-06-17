import React from 'react';

/**
 * Generate avatar URL dari data sender.
 */
function getSenderAvatar(message) {
    if (message.senderAvatar) return message.senderAvatar;
    if (message.sender?.profile_icon) {
        const icon = message.sender.profile_icon;
        if (icon.startsWith('/') || icon.startsWith('http')) return icon;
        return `/images/profile-icons/${icon}`;
    }
    const name = message.senderName || message.sender?.name || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

export default function MessageBubble({ message }) {
    if (message.type === 'day-divider') {
        return (
            <div className="flex justify-center py-2">
                <span className="rounded-full border border-secondary/45 bg-primary px-4 py-1 text-[11px] font-medium text-tertiary shadow-sm">
                    {message.label}
                </span>
            </div>
        );
    }

    const isSending = message._sending;

    if (message.isOwn) {
        return (
            <div className="flex justify-end">
                <div className="flex flex-col items-end max-w-[78%] md:max-w-[460px]">
                    <div
                        className={`rounded-2xl border border-secondary/55 bg-base px-4 py-2.5 shadow-sm ${
                            isSending ? 'opacity-60' : ''
                        }`}
                    >
                        {message.image ? (
                            <div className="overflow-hidden rounded-2xl border border-secondary/45 bg-base p-2 shadow-sm">
                                <img
                                    src={message.image}
                                    alt="attachment"
                                    className="h-20 w-20 rounded-xl object-cover md:h-24 md:w-24"
                                />
                            </div>
                        ) : (
                            <p className="font-roboto text-[13px] leading-snug text-tertiary md:text-[14px]">
                                {message.text || message.body}
                            </p>
                        )}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 px-1 text-[10px] text-tertiary/55 md:text-[11px]">
                        <span>{message.timestamp}</span>
                        {isSending && (
                            <span className="ml-1 text-tertiary/40">●</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-2">
            <div className="mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-base ring-2 ring-[#F7D8B0] md:h-9 md:w-9">
                <img
                    src={getSenderAvatar(message)}
                    alt={message.senderName || 'User'}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="max-w-[78%] md:max-w-[460px]">
                {message.image ? (
                    <div className="overflow-hidden rounded-2xl border border-secondary/45 bg-primary p-2 shadow-sm">
                        <img
                            src={message.image}
                            alt="attachment"
                            className="h-20 w-20 rounded-xl object-cover md:h-24 md:w-24"
                        />
                    </div>
                ) : (
                    <div className="inline-block rounded-2xl border border-secondary/45 bg-primary px-4 py-2.5 shadow-sm">
                        <p className="font-roboto text-[13px] leading-snug text-tertiary md:text-[14px]">
                            {message.text || message.body}
                        </p>
                    </div>
                )}

                <div className="mt-1 px-1 text-[10px] text-tertiary/55 md:text-[11px]">
                    {message.timestamp}
                </div>
            </div>
        </div>
    );
}
