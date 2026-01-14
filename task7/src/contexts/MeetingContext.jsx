import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [isInMeeting, setIsInMeeting] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState(null);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [activeView, setActiveView] = useState('video'); // 'video', 'whiteboard', 'files'
    const [whiteboardData, setWhiteboardData] = useState([]);

    const localVideoRef = useRef(null);

    // Initialize local media stream
    const initializeMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            // Try video only
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                setLocalStream(stream);
                setIsAudioEnabled(false);
                return stream;
            } catch (err) {
                console.error('Error accessing camera:', err);
                return null;
            }
        }
    }, []);

    // Create a new meeting room
    const createRoom = useCallback(() => {
        const newRoomId = uuidv4().slice(0, 8).toUpperCase();
        setRoomId(newRoomId);
        return newRoomId;
    }, []);

    // Join meeting
    const joinMeeting = useCallback(async (room, name) => {
        setRoomId(room);
        setUserName(name);

        const stream = await initializeMedia();
        if (stream) {
            // Add self to participants
            const selfParticipant = {
                id: 'local',
                name: name,
                stream: stream,
                isLocal: true,
                isAudioEnabled: true,
                isVideoEnabled: true,
            };
            setParticipants([selfParticipant]);

            // Simulate other participants joining (for demo)
            setTimeout(() => {
                const demoParticipants = [
                    { id: 'demo1', name: 'Alex Johnson', isLocal: false, isAudioEnabled: true, isVideoEnabled: true },
                    { id: 'demo2', name: 'Sarah Chen', isLocal: false, isAudioEnabled: true, isVideoEnabled: false },
                ];
                setParticipants(prev => [...prev, ...demoParticipants]);
            }, 2000);

            setIsInMeeting(true);
        }
    }, [initializeMedia]);

    // Leave meeting
    const leaveMeeting = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        setLocalStream(null);
        setScreenStream(null);
        setParticipants([]);
        setIsInMeeting(false);
        setIsScreenSharing(false);
        setSharedFiles([]);
        setChatMessages([]);
        setWhiteboardData([]);
    }, [localStream, screenStream]);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }, [localStream]);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }, [localStream]);

    // Start screen sharing
    const startScreenShare = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            setScreenStream(stream);
            setIsScreenSharing(true);

            // Handle when user stops sharing via browser UI
            stream.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };

            return stream;
        } catch (error) {
            console.error('Error starting screen share:', error);
            return null;
        }
    }, []);

    // Stop screen sharing
    const stopScreenShare = useCallback(() => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        setScreenStream(null);
        setIsScreenSharing(false);
    }, [screenStream]);

    // Add shared file
    const addSharedFile = useCallback((file) => {
        const fileData = {
            id: uuidv4(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            sharedBy: userName,
            timestamp: new Date().toISOString(),
        };
        setSharedFiles(prev => [...prev, fileData]);
    }, [userName]);

    // Send chat message
    const sendMessage = useCallback((message) => {
        const newMessage = {
            id: uuidv4(),
            text: message,
            sender: userName,
            timestamp: new Date().toISOString(),
            isLocal: true,
        };
        setChatMessages(prev => [...prev, newMessage]);
    }, [userName]);

    // Update whiteboard data
    const updateWhiteboard = useCallback((data) => {
        setWhiteboardData(prev => [...prev, data]);
    }, []);

    // Clear whiteboard
    const clearWhiteboard = useCallback(() => {
        setWhiteboardData([]);
    }, []);

    const value = {
        roomId,
        userName,
        isInMeeting,
        participants,
        localStream,
        isAudioEnabled,
        isVideoEnabled,
        isScreenSharing,
        screenStream,
        sharedFiles,
        chatMessages,
        activeView,
        whiteboardData,
        localVideoRef,
        setActiveView,
        createRoom,
        joinMeeting,
        leaveMeeting,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare,
        addSharedFile,
        sendMessage,
        updateWhiteboard,
        clearWhiteboard,
    };

    return (
        <MeetingContext.Provider value={value}>
            {children}
        </MeetingContext.Provider>
    );
}

export function useMeeting() {
    const context = useContext(MeetingContext);
    if (!context) {
        throw new Error('useMeeting must be used within a MeetingProvider');
    }
    return context;
}
