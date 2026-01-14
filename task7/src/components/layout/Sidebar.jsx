import React, { useState, useRef, useEffect } from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Users,
    MessageSquare,
    X,
    Send,
    Mic,
    MicOff,
    Video,
    VideoOff,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ParticipantsList() {
    const { participants } = useMeeting();

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participants ({participants.length})
                </h3>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {participants.map((participant) => (
                        <div
                            key={participant.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {participant.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">
                                    {participant.name} {participant.isLocal && '(You)'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {participant.isLocal ? 'Host' : 'Participant'}
                                </p>
                            </div>

                            <div className="flex items-center gap-1">
                                {participant.isAudioEnabled ? (
                                    <Mic className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <MicOff className="w-4 h-4 text-red-400" />
                                )}
                                {participant.isVideoEnabled ? (
                                    <Video className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <VideoOff className="w-4 h-4 text-red-400" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

function ChatPanel() {
    const { chatMessages, sendMessage, userName } = useMeeting();
    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </h3>
            </div>

            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No messages yet</p>
                        </div>
                    ) : (
                        chatMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col gap-1",
                                    msg.isLocal ? "items-end" : "items-start"
                                )}
                            >
                                <span className="text-xs text-gray-400">{msg.sender}</span>
                                <div
                                    className={cn(
                                        "max-w-[80%] px-4 py-2 rounded-2xl",
                                        msg.isLocal
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-gray-700 text-white rounded-bl-md"
                                    )}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border-gray-700"
                    />
                    <Button onClick={handleSend} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function Sidebar({ show, type, onClose }) {
    if (!show) return null;

    return (
        <div className="w-80 h-full bg-gray-900/95 backdrop-blur border-l border-gray-700/50 flex flex-col">
            <div className="flex justify-end p-2">
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {type === 'participants' ? <ParticipantsList /> : <ChatPanel />}
        </div>
    );
}
