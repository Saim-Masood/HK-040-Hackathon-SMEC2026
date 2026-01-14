import React, { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'

// Mock Label
const Label = ({ children, className, ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
        {children}
    </label>
)

export default function Profile() {
    const { currentUser, updateProfile } = useUser()
    const [name, setName] = useState(currentUser?.name || '')
    const [isEditing, setIsEditing] = useState(false)

    const handleSave = () => {
        if (name.trim()) {
            updateProfile(name)
            setIsEditing(false)
        }
    }

    return (
        <PageTransition>
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold">Your Profile</h2>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 p-1">
                            <img src={currentUser?.avatar} alt="Profile" className="h-full w-full rounded-full bg-secondary" />
                        </div>
                        <div>
                            <CardTitle>{currentUser?.name}</CardTitle>
                            <CardDescription>Member since {new Date(currentUser?.joinedAt).getFullYear()}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Display Name</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                />
                                {isEditing ? (
                                    <Button onClick={handleSave}>Save</Button>
                                ) : (
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800">
                            <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">Your ID</h4>
                            <code className="text-xs block break-all bg-white/50 dark:bg-black/20 p-2 rounded">{currentUser?.id}</code>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    )
}
