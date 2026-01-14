import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeeting } from '@/contexts/MeetingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Video,
    Users,
    Shield,
    Zap,
    PenTool,
    FolderOpen,
    Monitor,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const features = [
    {
        icon: Video,
        title: 'HD Video Calling',
        description: 'Crystal clear multi-user video conferencing',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Monitor,
        title: 'Screen Sharing',
        description: 'Share your screen with one click',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: PenTool,
        title: 'Whiteboard',
        description: 'Collaborative drawing and brainstorming',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: FolderOpen,
        title: 'File Sharing',
        description: 'Instantly share files with participants',
        color: 'from-green-500 to-emerald-500'
    }
];

export function Home() {
    const navigate = useNavigate();
    const { createRoom, joinMeeting } = useMeeting();
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState(null); // 'create' or 'join'
    const [error, setError] = useState('');

    const handleCreateRoom = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        const newRoomId = createRoom();
        await joinMeeting(newRoomId, name.trim());
        navigate('/meeting');
    };

    const handleJoinRoom = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!roomId.trim()) {
            setError('Please enter a room ID');
            return;
        }
        await joinMeeting(roomId.trim().toUpperCase(), name.trim());
        navigate('/meeting');
    };

    return (
        <div className="min-h-screen gradient-bg">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">CollabSpace</h1>
                        </div>

                        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Video Conferencing &<br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Collaboration Made Easy
                            </span>
                        </h2>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Connect with your team through HD video calls, share your screen,
                            collaborate on whiteboards, and share files - all in one place.
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
                        {!mode ? (
                            <>
                                <Card className="w-full md:w-80 bg-gray-900/80 backdrop-blur border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                                    onClick={() => setMode('create')}>
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Create Meeting</h3>
                                        <p className="text-gray-400 text-sm">Start a new meeting room and invite others</p>
                                    </CardContent>
                                </Card>

                                <Card className="w-full md:w-80 bg-gray-900/80 backdrop-blur border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
                                    onClick={() => setMode('join')}>
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Join Meeting</h3>
                                        <p className="text-gray-400 text-sm">Enter a room ID to join an existing meeting</p>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        {mode === 'create' ? <Sparkles className="w-5 h-5 text-blue-400" /> : <Users className="w-5 h-5 text-green-400" />}
                                        {mode === 'create' ? 'Create Meeting' : 'Join Meeting'}
                                    </CardTitle>
                                    <CardDescription>
                                        {mode === 'create' ? 'Start a new meeting room' : 'Enter room details to join'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                                        <Input
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setError(''); }}
                                            placeholder="Enter your name"
                                            className="bg-gray-800 border-gray-700 focus:border-blue-500"
                                        />
                                    </div>

                                    {mode === 'join' && (
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Room ID</label>
                                            <Input
                                                value={roomId}
                                                onChange={(e) => { setRoomId(e.target.value.toUpperCase()); setError(''); }}
                                                placeholder="Enter room ID"
                                                className="bg-gray-800 border-gray-700 focus:border-blue-500 font-mono"
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <p className="text-red-400 text-sm">{error}</p>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-gray-700"
                                            onClick={() => setMode(null)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-1 gap-2"
                                            onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
                                        >
                                            {mode === 'create' ? 'Create' : 'Join'}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-white mb-4">Powerful Features</h3>
                    <p className="text-gray-400">Everything you need for seamless collaboration</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2026 CollabSpace. Built for SMEC Hackathon.
                    </p>
                </div>
            </footer>
        </div>
    );
}
