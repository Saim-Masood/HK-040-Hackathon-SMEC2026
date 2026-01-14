import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRScanner } from '@/components/QRScanner'
import { useUser } from '@/context/UserContext'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function Scan() {
    const { addFriend } = useUser()
    const navigate = useNavigate()
    const [scanResult, setScanResult] = useState(null)
    const [error, setError] = useState(null)

    const handleScan = (text) => {
        console.log('Scanned text:', text)
        if (text) {
            try {
                const friendData = JSON.parse(text)
                console.log('Parsed friend data:', friendData)
                
                if (friendData.id && friendData.name) {
                    const result = addFriend(friendData)
                    console.log('Add friend result:', result)
                    
                    if (result.success) {
                        setScanResult(friendData)
                        setError(null)
                    } else {
                        setScanResult(null)
                        setError(result.message)
                    }
                } else {
                    setScanResult(null)
                    setError("Invalid QR Code format - missing required fields")
                }
            } catch (e) {
                console.error('Parse error:', e)
                setScanResult(null)
                setError("Invalid QR Code data - not valid JSON")
            }
        }
    }

    const handleReset = () => {
        setScanResult(null)
        setError(null)
        // Reloading to reset scanner cleanly is sometimes needed with html5-qrcode, 
        // but here we rely on the component mount/unmount or just clearing state.
        // simpler: navigate to home and back or just let user re-scan if component handles it.
        window.location.reload() // Quick fix for scanner reset
    }

    return (
        <PageTransition>
            <div className="space-y-6 pt-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Scan to Connect</h2>
                    <p className="text-muted-foreground">Point your camera at a friend's QR code</p>
                </div>

                {!scanResult && !error && (
                    <>
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        <p className="font-medium mb-1">How to scan:</p>
                                        <ol className="list-decimal list-inside space-y-1 text-xs">
                                            <li>Allow camera access when prompted</li>
                                            <li>Point your camera at the QR code</li>
                                            <li>Hold steady until it scans automatically</li>
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                            <QRScanner onScan={handleScan} onClose={() => navigate('/')} />
                        </div>
                    </>
                )}

                {scanResult && (
                    <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                        <CardHeader className="text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <CardTitle className="text-green-700 dark:text-green-400">Connected!</CardTitle>
                            <CardDescription>You are now friends with {scanResult.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center gap-4">
                            <Button onClick={() => navigate('/friends')}>View Friends</Button>
                            <Button variant="outline" onClick={handleReset}>Scan Another</Button>
                        </CardContent>
                    </Card>
                )}

                {error && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardHeader className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                            <CardTitle className="text-red-700 dark:text-red-400">
                                {error.includes('yourself') ? 'Cannot Add Yourself' : 'Connection Failed'}
                            </CardTitle>
                            <CardDescription className="text-base">{error}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center">
                                {error.includes('yourself') 
                                    ? 'Ask a friend to show you their QR code to connect with them.'
                                    : 'Please try scanning a different QR code.'}
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={handleReset}>Try Again</Button>
                                <Button onClick={() => navigate('/')}>Go Home</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageTransition>
    )
}
