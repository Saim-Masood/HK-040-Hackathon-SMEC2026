import React, { useEffect, useRef } from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { User, MicOff, VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

function VideoPlayer({ participant, className }) {
    const videoRef = useRef(null);
    const { localStream } = useMeeting();

    useEffect(() => {
        if (videoRef.current && participant.isLocal && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [participant, localStream]);

    const isVideoOn = participant.isLocal
        ? participant.isVideoEnabled
        : participant.isVideoEnabled;

    return (
        <div className={cn(
            "relative rounded-xl overflow-hidden bg-gray-900 aspect-video",
            "border border-gray-700/50 shadow-xl",
            className
        )}>
            {participant.stream || participant.isLocal ? (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={participant.isLocal}
                        className={cn(
                            "w-full h-full object-cover",
                            !isVideoOn && "hidden"
                        )}
                    />
                    {!isVideoOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                            {participant.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                    </div>
                </div>
            )}

            {/* Participant info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium truncate">
                        {participant.name} {participant.isLocal && '(You)'}
                    </span>
                    <div className="flex items-center gap-2">
                        {!participant.isAudioEnabled && (
                            <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                                <MicOff className="w-3 h-3 text-white" />
                            </div>
                        )}
                        {!isVideoOn && (
                            <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                                <VideoOff className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function VideoGrid() {
    const { participants, isScreenSharing, screenStream, localStream } = useMeeting();
    const screenVideoRef = useRef(null);

    useEffect(() => {
        if (screenVideoRef.current && screenStream) {
            screenVideoRef.current.srcObject = screenStream;
        }
    }, [screenStream]);

    const participantCount = participants.length;

    return (
        <div className="h-full w-full p-4">
            {isScreenSharing ? (
                <div className="h-full flex flex-col gap-4">
                    {/* Screen share main view */}
                    <div className="flex-1 rounded-xl overflow-hidden bg-gray-900 border border-gray-700/50">
                        <video
                            ref={screenVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Participants strip */}
                    <div className="h-32 flex gap-2 overflow-x-auto pb-2">
                        {participants.map((participant) => (
                            <VideoPlayer
                                key={participant.id}
                                participant={participant}
                                className="h-full aspect-video flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className={cn(
                    "video-grid h-full",
                    `participants-${Math.min(participantCount, 6)}`
                )}>
                    {participants.map((participant) => (
                        <VideoPlayer
                            key={participant.id}
                            participant={participant}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
