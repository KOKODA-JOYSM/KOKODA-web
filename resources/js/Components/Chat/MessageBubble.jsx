import React, { useState } from 'react';
import { avatarUrl } from '@/Components/Common/Avatar';
import RequestCardMessage from '@/Components/Chat/RequestCardMessage';
import { useTranslation } from '@/hooks/useTranslation';

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

/**
 * Image content for chat bubbles — renders the uploaded image with
 * a subtle border, rounded corners, and a lightbox on click.
 */
function BubbleImageContent({ message, isOwn, isSending }) {
    const { t } = useTranslation();
    const [showLightbox, setShowLightbox] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageUrl = message.image_url || message.image;

    return (
        <>
            <div className="relative">
                {/* Image with border */}
                <div
                    className="cursor-pointer overflow-hidden rounded-xl border-[1.5px] border-secondary/50"
                    onClick={() => setShowLightbox(true)}
                >
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                        <div className="flex h-44 w-44 items-center justify-center bg-secondary/15 md:h-52 md:w-52">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-tertiary" />
                        </div>
                    )}
                    <img
                        src={imageUrl}
                        alt={t('chat.chatImage')}
                        className={`max-h-[280px] min-h-[120px] w-auto min-w-[140px] max-w-[240px] object-cover transition-opacity duration-300 md:max-h-[320px] md:max-w-[280px] ${
                            imageLoaded ? 'opacity-100' : 'h-0 w-0 opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                    />
                </div>

                {/* Caption text below image (WhatsApp style) */}
                {message.body && message.body !== '📷 Image' ? (
                    <div className="relative mt-1.5">
                        <p
                            className="font-roboto text-[13px] leading-snug text-tertiary md:text-[14px]"
                            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                        >
                            {message.body}
                            <span
                                className="invisible inline-block h-0 select-none"
                                style={{ width: isOwn ? '5em' : '3em' }}
                                aria-hidden="true"
                            >
                                &nbsp;
                            </span>
                        </p>
                        <span className="absolute bottom-[1px] right-0 flex items-center gap-[3px] whitespace-nowrap select-none">
                            <span className="text-[10px] leading-none text-tertiary/50 md:text-[11px]">
                                {message.timestamp}
                            </span>
                            {isOwn && <MessageStatus isSending={isSending} isRead={message.isRead} />}
                        </span>
                    </div>
                ) : (
                    <div className="mt-1 flex items-center justify-end gap-[3px]">
                        <span className="text-[10px] leading-none text-tertiary/50 md:text-[11px]">
                            {message.timestamp}
                        </span>
                        {isOwn && <MessageStatus isSending={isSending} isRead={message.isRead} />}
                    </div>
                )}
            </div>

            {/* Lightbox overlay */}
            {showLightbox && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setShowLightbox(false)}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
                        onClick={() => setShowLightbox(false)}
                        aria-label={t('post.close')}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={imageUrl}
                        alt={t('chat.fullSize')}
                        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}

export default function MessageBubble({ message, onRequestRating, authUserId }) {
    const { t } = useTranslation();
    if (message.type === 'card') {
        return (
            <RequestCardMessage
                message={message}
                onRequestRating={onRequestRating}
                authUserId={authUserId}
            />
        );
    }

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
    const isImage = message.type === 'image' || message.image_url || message.image;

    // ── Own message (right-aligned) ──────────────────────────────
    if (message.isOwn) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[78%] md:max-w-[460px]">
                    <div
                        className={`rounded-lg border border-secondary/55 bg-base px-3 py-2 shadow-sm ${
                            isSending ? 'opacity-60' : ''
                        }`}
                    >
                        {isImage ? (
                            <BubbleImageContent
                                message={message}
                                isOwn={true}
                                isSending={isSending}
                            />
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
                    alt={message.senderName || t('chat.userFallback')}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="max-w-[78%] md:max-w-[460px]">
                <div
                    className={`inline-block rounded-lg border border-secondary/45 bg-primary shadow-sm ${
                        isImage ? 'px-2 py-2' : 'px-3 py-2'
                    }`}
                >
                    {isImage ? (
                        <BubbleImageContent
                            message={message}
                            isOwn={false}
                            isSending={false}
                        />
                    ) : (
                        <BubbleTextContent
                            message={message}
                            isOwn={false}
                            isSending={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
