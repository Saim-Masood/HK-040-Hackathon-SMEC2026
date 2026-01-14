import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, AlertCircle } from 'lucide-react'

export function QRScanner({ onScan, onClose }) {
    const [scanResult, setScanResult] = useState(null)
    const [cameraError, setCameraError] = useState(null)
    const scannerRef = useRef(null)
    const isInitialized = useRef(false)
    const observerRef = useRef(null)

    useEffect(() => {
        // Prevent multiple initializations
        if (!isInitialized.current) {
            isInitialized.current = true
            
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                // Don't show the default success message
                disableFlip: false
            }

            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                config,
                /* verbose= */ false
            )

            scannerRef.current.render(success, error)
            
            // Set up MutationObserver to hide result text
            const readerElement = document.getElementById('reader')
            if (readerElement) {
                observerRef.current = new MutationObserver(() => {
                    hideResultText()
                })
                
                observerRef.current.observe(readerElement, {
                    childList: true,
                    subtree: true,
                    characterData: true
                })
                
                // Initial hide
                setTimeout(hideResultText, 500)
            }
        }

        function hideResultText() {
            const readerElement = document.getElementById('reader')
            if (readerElement) {
                // Find and hide any div containing JSON or result text
                const allDivs = readerElement.querySelectorAll('div')
                allDivs.forEach(div => {
                    const text = div.innerText || div.textContent || ''
                    // Hide if it contains JSON-like content or result messages
                    if (text.includes('{') || text.includes('}') || 
                        text.includes('Last scan') || text.includes('Code scan')) {
                        div.style.display = 'none'
                    }
                })
            }
        }

        function success(result) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {})
            }
            setScanResult(result)
            hideResultText()
            onScan(result)
        }

        function error(err) {
            // Only log actual errors, not scanning attempts
            if (err && !err.includes('NotFoundException')) {
                console.warn('QR Scanner error:', err)
                if (err.includes('NotAllowedError') || err.includes('Permission')) {
                    setCameraError('Camera permission denied. Please allow camera access.')
                } else if (err.includes('NotFoundError')) {
                    setCameraError('No camera found on this device.')
                }
            }
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {})
                scannerRef.current = null
            }
            isInitialized.current = false
        }
    }, [onScan])

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Scan QR Code
                </CardTitle>
            </CardHeader>
            <CardContent>
                {cameraError && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-700 dark:text-red-400">
                                <p className="font-medium">Camera Access Required</p>
                                <p className="mt-1">{cameraError}</p>
                                <p className="mt-2 text-xs">Please check your browser settings and allow camera access for this site.</p>
                            </div>
                        </div>
                    </div>
                )}
                <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
                {scanResult && (
                    <div className="mt-4 text-center">
                        <p className="text-green-500 font-medium">Scanned successfully!</p>
                    </div>
                )}
                <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={onClose}>Stop Scanning</Button>
                </div>
            </CardContent>
        </Card>
    )
}
