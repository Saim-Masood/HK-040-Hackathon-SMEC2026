import React from 'react'
import { useUser } from '@/context/UserContext'
import { QRGenerator } from '@/components/QRGenerator'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Scan, Share2 } from 'lucide-react'

export default function Home() {
    const { currentUser } = useUser()

    if (!currentUser) return null

    // Create a JSON string for the QR code payload
    const qrPayload = JSON.stringify({
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
    })

    return (
        <PageTransition>
            <div className="space-y-8 flex flex-col items-center pt-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Connect Instantly</h2>
                    <p className="text-muted-foreground">Share your code to connect</p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <QRGenerator value={qrPayload} title={currentUser.name} />
                    </div>
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                    <Button className="flex-1 gap-2" size="lg" asChild>
                        <Link to="/scan">
                            <Scan className="w-4 h-4" />
                            Scan Code
                        </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2" size="lg">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                </div>
            </div>
        </PageTransition>
    )
}
