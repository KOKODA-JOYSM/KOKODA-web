import React from 'react';
import { Image as ImageIcon, Plus, Send } from 'lucide-react';

export default function MessageInput({ value, onChange, onSend, disabled = false }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <div className="shrink-0 border-t border-secondary/25 bg-[#FBF4E8] px-4 py-4 md:px-6 md:py-5">
            <div className="mx-auto flex w-full max-w-[760px] items-center gap-2 rounded-full border border-secondary/35 bg-base px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.08)] md:gap-3 md:px-4">
                <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-secondary/45 text-tertiary/70 transition-colors hover:bg-primary/50"
                    aria-label="Add"
                >
                    <Plus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-secondary/45 text-tertiary/70 transition-colors hover:bg-primary/50"
                    aria-label="Attach image"
                >
                    <ImageIcon className="h-4 w-4" />
                </button>

                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={disabled}
                    className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-roboto text-[13px] text-tertiary placeholder:text-tertiary/35 focus:outline-none focus:ring-0 md:text-[14px] disabled:opacity-50"
                />

                <button
                    type="button"
                    onClick={onSend}
                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-tertiary transition-transform hover:scale-105 hover:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                    disabled={!value.trim() || disabled}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
