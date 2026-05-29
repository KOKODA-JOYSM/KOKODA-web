import React, { useEffect, useRef } from 'react';
import MessageBubble from '@/Components/Chat/MessageBubble';

export default function MessageList({ messages }) {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col justify-end gap-3 md:gap-4">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
}
