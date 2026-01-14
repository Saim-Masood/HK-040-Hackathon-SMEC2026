import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function QRGenerator({ value, title = "Your QR Code", description = "Scan updates to connect" }) {
    return (
        <Card className="w-full max-w-sm mx-auto overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {title}
                </CardTitle>
                <CardDescription className="text-gray-400">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-8 bg-white/5">
                <div className="p-4 bg-white rounded-xl shadow-lg">
                    <QRCodeSVG
                        value={value}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
