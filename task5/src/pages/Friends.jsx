import React from 'react'
import { useUser } from '@/context/UserContext'
import { PageTransition } from '@/components/PageTransition'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar' // We need to create this or simulation
import { UserCheck } from 'lucide-react'

// Simple Avatar component since we didn't implement the full shadcn one yet to save time
function UserAvatar({ src, alt }) {
    return (
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
            <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
    )
}

export default function Friends() {
    const { friends } = useUser()

    return (
        <PageTransition>
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Friends</h2>
                        <p className="text-muted-foreground">Your connected network</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {friends.length} Connected
                    </div>
                </div>

                <div className="grid gap-4">
                    {friends.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <UserCheck className="h-12 w-12 mb-4 opacity-50" />
                                <p>No friends connected yet.</p>
                                <p className="text-sm">Scan a QR code to start connecting!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        friends.map((friend) => (
                            <Card key={friend.id} className="overflow-hidden transition-all hover:bg-accent/50">
                                <div className="flex items-center p-4 gap-4">
                                    <UserAvatar src={friend.avatar} alt={friend.name} />
                                    <div className="flex-1">
                                        <h3 className="font-medium truncate">{friend.name}</h3>
                                        <p className="text-xs text-muted-foreground">Connected {new Date(friend.connectedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
