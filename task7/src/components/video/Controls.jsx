import React from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    MonitorOff,
    PhoneOff,
    MessageSquare,
    Users,
    PenTool,
    FolderOpen,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Controls({ onToggleChat, onToggleParticipants, showChat, showParticipants }) {
    const {
        isAudioEnabled,
        isVideoEnabled,
        isScreenSharing,
        activeView,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare,
        leaveMeeting,
        setActiveView,
    } = useMeeting();

    return (
        <TooltipProvider>
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700/50">
                {/* Audio toggle */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isAudioEnabled ? "secondary" : "destructive"}
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={toggleAudio}
                        >
                            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isAudioEnabled ? 'Mute' : 'Unmute'}
                    </TooltipContent>
                </Tooltip>

                {/* Video toggle */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isVideoEnabled ? "secondary" : "destructive"}
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={toggleVideo}
                        >
                            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    </TooltipContent>
                </Tooltip>

                {/* Screen share */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isScreenSharing ? "default" : "secondary"}
                            size="icon"
                            className={cn(
                                "rounded-full w-12 h-12",
                                isScreenSharing && "bg-green-600 hover:bg-green-700"
                            )}
                            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                        >
                            {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isScreenSharing ? 'Stop sharing' : 'Share screen'}
                    </TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                {/* View toggles */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={activeView === 'video' ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full w-10 h-10"
                            onClick={() => setActiveView('video')}
                        >
                            <Video className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video View</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={activeView === 'whiteboard' ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full w-10 h-10"
                            onClick={() => setActiveView('whiteboard')}
                        >
                            <PenTool className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Whiteboard</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={activeView === 'files' ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full w-10 h-10"
                            onClick={() => setActiveView('files')}
                        >
                            <FolderOpen className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Files</TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                {/* Participants */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={showParticipants ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full w-10 h-10"
                            onClick={onToggleParticipants}
                        >
                            <Users className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Participants</TooltipContent>
                </Tooltip>

                {/* Chat */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={showChat ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full w-10 h-10"
                            onClick={onToggleChat}
                        >
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat</TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                {/* Leave call */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full w-12 h-12"
                            onClick={leaveMeeting}
                        >
                            <PhoneOff className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Leave meeting</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
