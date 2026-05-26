import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ConversationList from '@/Components/Chat/ConversationList';
import ChatHeader from '@/Components/Chat/ChatHeader';
import MessageList from '@/Components/Chat/MessageList';
import MessageInput from '@/Components/Chat/MessageInput';

const conversations = [
    {
        id: 1,
        name: 'The Stone',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=The%20Stone',
        lastMessage: 'Tasnya merk BODIPACK, isinya lap...',
        timestamp: 'Yesterday',
        unreadCount: 2,
        isOnline: false,
    },
    {
        id: 2,
        name: 'Elena Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Rodriguez',
        lastMessage: 'Ada kode ER di belakangnya',
        timestamp: '15:34',
        unreadCount: 0,
        isOnline: true,
    },
    {
        id: 3,
        name: 'Marcus Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Chen',
        lastMessage: 'Gw otw, ntar ketemuan di gedung d...',
        timestamp: '18:74',
        unreadCount: 0,
        isOnline: false,
    },
];

const initialMessagesByConversation = {
    1: [
        {
            id: 1,
            senderId: 1,
            senderName: 'You',
            text: 'Kalau ada kabar, kabari saya ya.',
            timestamp: '09:10',
            isOwn: true,
        },
    ],
    2: [
        {
            id: 1,
            senderId: 2,
            senderName: 'Elena Rodriguez',
            text: 'Halo, aku lihat postinganmu, tadi kamu menanya topi? Itu kelihatannya punyaku deh...',
            timestamp: '19:48',
            isOwn: false,
        },
        {
            id: 2,
            senderId: 1,
            senderName: 'You',
            text: 'Halo juga Elena. Dia? Detail hilangannya gimana? Coba jelasin mendetail dong',
            timestamp: '20:53',
            isOwn: true,
        },
        {
            id: 3,
            type: 'day-divider',
            label: 'Today',
        },
        {
            id: 4,
            senderId: 2,
            senderName: 'Elena Rodriguez',
            image: 'https://api.dicebear.com/7.x/bottts/svg?seed=blue-cap',
            timestamp: '15:34',
            isOwn: false,
        },
        {
            id: 5,
            senderId: 2,
            senderName: 'Elena Rodriguez',
            text: 'Warnanya biru',
            timestamp: '15:34',
            isOwn: false,
        },
        {
            id: 6,
            senderId: 2,
            senderName: 'Elena Rodriguez',
            text: 'Merk adidas',
            timestamp: '15:34',
            isOwn: false,
        },
        {
            id: 7,
            senderId: 2,
            senderName: 'Elena Rodriguez',
            text: 'Ada kode ER di belakangnya',
            timestamp: '15:34',
            isOwn: false,
        },
    ],
    3: [
        {
            id: 1,
            senderId: 3,
            senderName: 'Marcus Chen',
            text: 'Saya lagi di lobi gedung.',
            timestamp: '18:10',
            isOwn: false,
        },
        {
            id: 2,
            senderId: 1,
            senderName: 'You',
            text: 'Oke, tunggu sebentar ya.',
            timestamp: '18:12',
            isOwn: true,
        },
    ],
};

function formatMessageTime() {
    return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ChatPage() {
    const [showConversationList, setShowConversationList] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(conversations[1]);
    const [draftMessage, setDraftMessage] = useState('');
    const [messages, setMessages] = useState(initialMessagesByConversation[2]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        setMessages(initialMessagesByConversation[conversation.id] || []);
        setShowConversationList(false);
        setDraftMessage('');
    };

    const handleSendMessage = () => {
        const trimmedMessage = draftMessage.trim();

        if (!trimmedMessage) {
            return;
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: currentMessages.length + 1,
                senderId: 1,
                senderName: 'You',
                text: trimmedMessage,
                timestamp: formatMessageTime(),
                isOwn: true,
            },
        ]);
        setDraftMessage('');
    };

    return (
        <AppLayout title="Chat - KOKODA">
            <div className="h-screen w-full overflow-hidden bg-background sm:pt-0">
                <div className="flex h-full min-h-0 flex-col overflow-hidden sm:flex-row md:flex-row">
                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedConversation.id}
                        onSelectConversation={handleSelectConversation}
                        isOpen={showConversationList}
                    />

                    <section className={`relative min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#FBF4E8] ${showConversationList ? 'hidden sm:flex' : 'flex'}`}>
                        <ChatHeader
                            conversation={selectedConversation}
                            onShowConversations={() => setShowConversationList((current) => !current)}
                        />

                        <MessageList messages={messages} />

                        <MessageInput
                            value={draftMessage}
                            onChange={setDraftMessage}
                            onSend={handleSendMessage}
                        />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
