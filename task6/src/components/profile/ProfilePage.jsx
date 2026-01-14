import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/store/useStore'
import { formatNumber, formatDate, cn } from '@/lib/utils'
import { PostCard } from '@/components/post/PostCard'
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Grid3X3, 
  Heart, 
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  Settings,
  Image as ImageIcon
} from 'lucide-react'

export function ProfilePage() {
  const { 
    selectedProfile, 
    currentUser, 
    getPostsByUserId, 
    followUser,
    users,
    getUserById,
    setActiveView,
    setSelectedProfile
  } = useStore()
  
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  const user = selectedProfile || currentUser
  const posts = getPostsByUserId(user.id)
  const isOwnProfile = user.id === currentUser.id
  const isFollowing = currentUser.following.includes(user.id)

  const postsWithImages = posts.filter(p => p.image)
  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0)

  const handleBack = () => {
    setActiveView('feed')
    setSelectedProfile(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      {!isOwnProfile && (
        <Button 
          variant="ghost" 
          className="mb-4 gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>
      )}

      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div 
          className="h-48 md:h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${user.cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <CardContent className="relative pb-6">
          {/* Avatar */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="gradient-bg text-white text-3xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="mt-4 md:mt-0 md:mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.verified && (
                    <Badge variant="gradient" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 md:mt-0">
              {isOwnProfile ? (
                <>
                  <Button variant="outline" onClick={() => setActiveView('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? 'outline' : 'gradient'}
                    onClick={() => followUser(user.id)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-[15px] whitespace-pre-wrap">{user.bio}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.location}
              </span>
            )}
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <LinkIcon className="h-4 w-4" />
                {user.website.replace('https://', '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(user.joinedAt)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <button 
              className="hover:underline"
              onClick={() => setShowFollowers(true)}
            >
              <span className="font-bold">{formatNumber(user.followers.length)}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </button>
            <button 
              className="hover:underline"
              onClick={() => setShowFollowing(true)}
            >
              <span className="font-bold">{formatNumber(user.following.length)}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </button>
            <div>
              <span className="font-bold">{formatNumber(totalLikes)}</span>
              <span className="text-muted-foreground ml-1">Likes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts" className="flex-1 gap-2">
            <Grid3X3 className="h-4 w-4" />
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 gap-2">
            <ImageIcon className="h-4 w-4" />
            Media ({postsWithImages.length})
          </TabsTrigger>
          <TabsTrigger value="likes" className="flex-1 gap-2">
            <Heart className="h-4 w-4" />
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-4">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          {postsWithImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {postsWithImages.map(post => (
                <div 
                  key={post.id} 
                  className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No media posts yet</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Liked posts will appear here</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Followers Modal */}
      <UserListModal
        open={showFollowers}
        onOpenChange={setShowFollowers}
        title="Followers"
        userIds={user.followers}
      />

      {/* Following Modal */}
      <UserListModal
        open={showFollowing}
        onOpenChange={setShowFollowing}
        title="Following"
        userIds={user.following}
      />
    </div>
  )
}

function UserListModal({ open, onOpenChange, title, userIds }) {
  const { getUserById, followUser, currentUser, setSelectedProfile, setActiveView } = useStore()

  const handleUserClick = (userId) => {
    setSelectedProfile(userId)
    setActiveView('profile')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3 py-2">
            {userIds.length > 0 ? (
              userIds.map(userId => {
                const user = getUserById(userId)
                if (!user) return null
                const isFollowing = currentUser.following.includes(user.id)
                const isOwnProfile = user.id === currentUser.id

                return (
                  <div key={user.id} className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="gradient-bg text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {user.name}
                          {user.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    {!isOwnProfile && (
                      <Button
                        variant={isFollowing ? 'outline' : 'gradient'}
                        size="sm"
                        onClick={() => followUser(user.id)}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground py-4">No users yet</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
