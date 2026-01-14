import React from 'react';
import { useMeeting } from '@/contexts/MeetingContext';
import { Clock, Copy, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
    const { roomId, participants } = useMeeting();
    const [copied, setCopied] = React.useState(false);

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-16 px-4 flex items-center justify-between bg-gray-900/90 backdrop-blur border-b border-gray-700/50">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white">CollabSpace</h1>
                        <p className="text-xs text-gray-400">Video Conference</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-700" />

                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700"
                    onClick={copyRoomId}
                >
                    <span className="text-gray-400">Room:</span>
                    <span className="text-white font-mono">{roomId}</span>
                    {copied ? (
                        <Check className="w-3 h-3 text-green-400" />
                    ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                    )}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-mono">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {participants.length} in meeting
                </div>
            </div>
        </div>
    );
}
