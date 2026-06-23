import React from 'react';
import { avatarUrl } from '@/Components/Common/Avatar';

/**
 * Generate avatar URL dari data sender.
 * Uses the shared avatarUrl() helper for consistent profile icon path handling.
 */
function getSenderAvatar(message) {
    // Try the pre-computed senderAvatar first
    if (message.senderAvatar) return message.senderAvatar;
    // Use the shared helper that normalises relative paths correctly
    const url = avatarUrl(message.sender);
    if (url) return url;
    // Fallback: generated avatar from sender name
    const name = message.senderName || message.sender?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4C799&color=311A05`;
}

/**
 * WhatsApp-style checkmark SVG for message status.
 * - Single grey check = delivered (sent to server)
 * - Double blue check = read by recipient
 */
function MessageStatus({ isSending, isRead }) {
    if (isSending) {
        // Clock icon while sending
        return (
            <svg
                className="inline-block shrink-0"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'rgba(76, 76, 76, 0.4)' }}
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        );
    }

    if (isRead) {
        // Double check — blue (read)
        return (
            <svg
                className="inline-block shrink-0"
                width="18"
                height="11"
                viewBox="0 0 18 12"
                fill="none"
            >
                <path
                    d="M1.5 6.5L5.5 10.5L12.5 1.5"
                    stroke="#34B7F1"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6.5 6.5L10.5 10.5L17 1.5"
                    stroke="#34B7F1"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    // Single check — grey (delivered but not read)
    return (
        <svg
            className="inline-block shrink-0"
            width="14"
            height="11"
            viewBox="0 0 14 12"
            fill="none"
        >
            <path
                d="M1.5 6.5L5.5 10.5L12.5 1.5"
                stroke="rgba(76, 76, 76, 0.55)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * Timestamp + status metadata displayed at bottom-right inside the bubble.
 * Absolutely positioned over the invisible spacer.
 */
function TimestampMeta({ timestamp, isOwn, isSending, isRead }) {
    return (
        <span
            className="absolute bottom-[1px] right-0 flex items-center gap-[3px] whitespace-nowrap select-none"
        >
            <span className="text-[10px] leading-none text-tertiary/50 md:text-[11px]">
                {timestamp}
            </span>
            {isOwn && <MessageStatus isSending={isSending} isRead={isRead} />}
        </span>
    );
}

/**
 * WhatsApp-style text bubble content.
 *
 * Technique: We use an invisible spacer (same width as timestamp + checks)
 * at the end of the text to reserve space so the absolutely-positioned
 * timestamp never overlaps the message. The bubble itself is `position:
 * relative` so the timestamp anchors to its bottom-right corner.
 */
function BubbleTextContent({ message, isOwn, isSending }) {
    // Width of the spacer — enough for "09:01" + check icon + gaps
    const spacerWidth = isOwn ? '5em' : '3em';

    return (
        <div className="relative">
            <p
                className="font-roboto text-[13px] leading-snug text-tertiary md:text-[14px]"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
                {message.text || message.body}
                {/* Invisible spacer to keep room for the absolute-positioned timestamp */}
                <span
                    className="invisible inline-block h-0 select-none"
                    style={{ width: spacerWidth }}
                    aria-hidden="true"
                >
                    &nbsp;
                </span>
            </p>
            <TimestampMeta
                timestamp={message.timestamp}
                isOwn={isOwn}
                isSending={isSending}
                isRead={message.isRead}
            />
        </div>
    );
}

export default function MessageBubble({ message }) {
    if (message.type === 'day-divider') {
        return (
            <div className="flex justify-center py-2">
                <span className="rounded-lg border border-secondary/45 bg-primary px-4 py-1 text-[11px] font-medium text-tertiary shadow-sm">
                    {message.label}
                </span>
            </div>
        );
    }

    const isSending = message._sending;

    // ── Own message (right-aligned) ──────────────────────────────
    if (message.isOwn) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[78%] md:max-w-[460px]">
                    <div
                        className={`rounded-lg border border-secondary/55 bg-base px-3 py-2 shadow-sm ${isSending ? 'opacity-60' : ''
                            }`}
                    >
                        {message.image ? (
                            <>
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src={message.image}
                                        alt="attachment"
                                        className="h-20 w-20 rounded-xl object-cover md:h-24 md:w-24"
                                    />
                                </div>
                                <div className="mt-1 flex items-center justify-end gap-3">
                                    <span className="text-[10px] leading-none text-tertiary/50 md:text-[12px]">
                                        {message.timestamp}
                                    </span>
                                    <MessageStatus isSending={isSending} isRead={message.isRead} />
                                </div>
                            </>
                        ) : (
                            <BubbleTextContent
                                message={message}
                                isOwn={true}
                                isSending={isSending}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── Other user's message (left-aligned with avatar) ─────────
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
                        <div className="mt-1 flex items-center justify-end gap-[3px]">
                            <span className="text-[10px] leading-none text-tertiary/50 md:text-[11px]">
                                {message.timestamp}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div
                        className="inline-block rounded-lg border border-secondary/45 bg-primary px-3 py-2 shadow-sm"
                    >
                        <BubbleTextContent
                            message={message}
                            isOwn={false}
                            isSending={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
