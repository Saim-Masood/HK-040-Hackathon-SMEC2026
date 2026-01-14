import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { formatDate, cn } from '@/lib/utils'
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign,
  CheckCircle2,
  Settings,
  Check
} from 'lucide-react'

// Generate mock notifications
const generateNotifications = (users, currentUser) => {
  return [
    {
      id: 1,
      type: 'follow',
      userId: 'user2',
      message: 'started following you',
      createdAt: '2026-01-14T10:00:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'like',
      userId: 'user3',
      message: 'liked your post',
      postPreview: 'Excited to announce that our new feature...',
      createdAt: '2026-01-14T09:30:00Z',
      read: false,
    },
    {
      id: 3,
      type: 'comment',
      userId: 'user4',
      message: 'commented on your post',
      postPreview: 'This looks amazing! The colors are perfect 👌',
      createdAt: '2026-01-14T08:15:00Z',
      read: true,
    },
    {
      id: 4,
      type: 'mention',
      userId: 'user5',
      message: 'mentioned you in a comment',
      postPreview: '@alexj check this out!',
      createdAt: '2026-01-13T16:45:00Z',
      read: true,
    },
    {
      id: 5,
      type: 'follow',
      userId: 'user6',
      message: 'started following you',
      createdAt: '2026-01-13T14:20:00Z',
      read: true,
    },
    {
      id: 6,
      type: 'like',
      userId: 'user7',
      message: 'liked your comment',
      postPreview: 'Great tip! I also like to pair program...',
      createdAt: '2026-01-13T11:00:00Z',
      read: true,
    },
  ]
}

export function NotificationsPage() {
  const { users, getUserById, currentUser, setSelectedProfile, setActiveView } = useStore()
  const [notifications, setNotifications] = useState(generateNotifications(users, currentUser))
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ))

    // Navigate to user profile
    if (notification.userId) {
      setSelectedProfile(notification.userId)
      setActiveView('profile')
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow': return <UserPlus className="h-4 w-4 text-primary" />
      case 'like': return <Heart className="h-4 w-4 text-pink-500" />
      case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'mention': return <AtSign className="h-4 w-4 text-orange-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6 gradient-bg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl relative">
              <Bell className="h-8 w-8" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-white/80">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={markAllAsRead}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'unread', 'follow', 'like', 'comment', 'mention'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={cn(filter === f && 'gradient-bg')}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => {
            const user = getUserById(notification.userId)
            if (!user) return null

            return (
              <Card 
                key={notification.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  !notification.read && 'border-l-4 border-l-primary bg-primary/5'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="gradient-bg text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background flex items-center justify-center border">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{user.name}</span>
                        {user.verified && (
                          <CheckCircle2 className="inline h-3.5 w-3.5 text-primary mx-1" />
                        )}
                        <span className="text-muted-foreground"> {notification.message}</span>
                      </p>
                      {notification.postPreview && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          "{notification.postPreview}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full gradient-bg self-center" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No notifications to show</p>
          </Card>
        )}
      </div>
    </div>
  )
}
