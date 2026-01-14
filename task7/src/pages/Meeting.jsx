import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeeting } from '@/contexts/MeetingContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoGrid } from '@/components/video/VideoGrid';
import { Controls } from '@/components/video/Controls';
import { Whiteboard } from '@/components/whiteboard/Whiteboard';
import { FileSharing } from '@/components/file-sharing/FileSharing';

export function Meeting() {
    const navigate = useNavigate();
    const { isInMeeting, activeView } = useMeeting();
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);

    useEffect(() => {
        if (!isInMeeting) {
            navigate('/');
        }
    }, [isInMeeting, navigate]);

    if (!isInMeeting) {
        return null;
    }

    const toggleChat = () => {
        setShowChat(!showChat);
        if (!showChat) setShowParticipants(false);
    };

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
        if (!showParticipants) setShowChat(false);
    };

    const closeSidebar = () => {
        setShowChat(false);
        setShowParticipants(false);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-950">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                        {activeView === 'video' && <VideoGrid />}
                        {activeView === 'whiteboard' && <Whiteboard />}
                        {activeView === 'files' && <FileSharing />}
                    </div>

                    <Controls
                        onToggleChat={toggleChat}
                        onToggleParticipants={toggleParticipants}
                        showChat={showChat}
                        showParticipants={showParticipants}
                    />
                </div>

                {/* Sidebar */}
                <Sidebar
                    show={showChat || showParticipants}
                    type={showChat ? 'chat' : 'participants'}
                    onClose={closeSidebar}
                />
            </div>
        </div>
    );
}
