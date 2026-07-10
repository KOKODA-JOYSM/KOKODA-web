import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Animated typing dots — smooth pulsing opacity like iMessage / WhatsApp.
 * Uses a CSS @keyframes injected via a <style> tag to avoid needing
 * tailwind.config changes.
 */
function TypingDots() {
    return (
        <>
            {/* Scoped keyframes for the pulsing dot animation */}
            <style>{`
                @keyframes typing-pulse {
                    0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
                    30% { opacity: 1; transform: scale(1); }
                }
            `}</style>
            <span className="inline-flex items-center gap-[3px]">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-[5px] w-[5px] rounded-full"
                        style={{
                            backgroundColor: '#008000',
                            animation: 'typing-pulse 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </span>
        </>
    );
}

/**
 * Status subtitle — shows typing, online, or offline with smooth
 * cross-fade transitions so the text doesn't jump.
 */
function StatusLine({ isTyping, isOnline, typingUsers }) {
    const { t } = useTranslation();
    // Build typing label
    const typingLabel =
        typingUsers.length === 1
            ? t('chat.typing')
            : `${typingUsers.length} ${t('chat.peopleTyping')}`;

    return (
        <div className="relative h-4 overflow-hidden">
            {/* ── Typing state ─────────────────────────────── */}
            <div
                className="absolute inset-x-0 flex items-center gap-[5px] transition-all duration-300 ease-in-out"
                style={{
                    opacity: isTyping ? 1 : 0,
                    transform: isTyping ? 'translateY(0)' : 'translateY(-8px)',
                    pointerEvents: isTyping ? 'auto' : 'none',
                }}
            >
                <TypingDots />
                <span className="text-[11px] font-medium text-online-color md:text-[12px]">
                    {typingLabel}
                </span>
            </div>

            {/* ── Online state ─────────────────────────────── */}
            <div
                className="absolute inset-x-0 flex items-center gap-1.5 transition-all duration-300 ease-in-out"
                style={{
                    opacity: !isTyping && isOnline ? 1 : 0,
                    transform: !isTyping && isOnline ? 'translateY(0)' : 'translateY(8px)',
                    pointerEvents: !isTyping && isOnline ? 'auto' : 'none',
                }}
            >
                <span className="h-2 w-2 rounded-full bg-online-color"></span>
                <span className="text-[11px] text-tertiary/65 md:text-[12px]">{t('chat.online')}</span>
            </div>

            {/* ── Offline state ────────────────────────────── */}
            <div
                className="absolute inset-x-0 flex items-center gap-1.5 transition-all duration-300 ease-in-out"
                style={{
                    opacity: !isTyping && !isOnline ? 1 : 0,
                    transform: !isTyping && !isOnline ? 'translateY(0)' : 'translateY(8px)',
                    pointerEvents: !isTyping && !isOnline ? 'auto' : 'none',
                }}
            >
                <span className="h-2 w-2 rounded-full bg-tertiary/40"></span>
                <span className="text-[11px] text-tertiary/40 md:text-[12px]">{t('chat.offline')}</span>
            </div>
        </div>
    );
}

export default function ChatHeader({ conversation, onShowConversations, typingUsers = [] }) {
    const { t } = useTranslation();
    const isTyping = typingUsers.length > 0;

    return (
        <div className="flex shrink-0 items-center justify-between border-b border-secondary/35 bg-[#FBF4E8] px-4 py-3 md:px-6 md:py-4">
            <div className="flex min-w-0 items-center gap-3 pb-2 pt-4">
                <button
                    type="button"
                    onClick={onShowConversations}
                    className="inline-flex h-10 w-10 mr-2 items-center justify-center rounded-full bg-primary text-base shadow-sm sm:hidden"
                    aria-label={t('chat.showConversations')}
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
                    <StatusLine
                        isTyping={isTyping}
                        isOnline={conversation.isOnline}
                        typingUsers={typingUsers}
                    />
                </div>
            </div>
        </div>
    );
}
