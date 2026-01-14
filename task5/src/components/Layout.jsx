import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { QrCode, Scan, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Layout({ children }) {
    const location = useLocation()

    const navItems = [
        { href: '/', icon: QrCode, label: 'Home' },
        { href: '/scan', icon: Scan, label: 'Scan' },
        { href: '/friends', icon: Users, label: 'Friends' },
        { href: '/profile', icon: User, label: 'Profile' }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans text-gray-900 dark:text-gray-100">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-14 items-center justify-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        QR Connect
                    </h1>
                </div>
            </header>

            <main className="flex-1 container py-6 mx-auto px-4 max-w-md">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur pb-safe">
                <div className="flex h-16 items-center justify-around px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-colors px-4 py-2 rounded-lg",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
