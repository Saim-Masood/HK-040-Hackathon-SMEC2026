import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/store/useStore'
import { formatNumber } from '@/lib/utils'
import { TrendingUp, Hash, Sparkles } from 'lucide-react'

export function Sidebar() {
  const { currentUser, users, setSelectedProfile, setActiveView } = useStore()

  // Get suggested users (not following)
  const suggestedUsers = users
    .filter(u => u.id !== currentUser.id && !currentUser.following.includes(u.id))
    .slice(0, 3)

  // Trending topics
  const trendingTopics = [
    { tag: 'TechInnovation', posts: '12.5K' },
    { tag: 'DesignTrends', posts: '8.2K' },
    { tag: 'StartupLife', posts: '6.8K' },
    { tag: 'Photography', posts: '5.4K' },
    { tag: 'NewMusic', posts: '4.1K' },
  ]

  const handleUserClick = (userId) => {
    setSelectedProfile(userId)
    setActiveView('profile')
  }

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Current user card */}
        <Card className="overflow-hidden">
          <div 
            className="h-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentUser.cover})` }}
          />
          <CardContent className="pt-0">
            <div className="flex flex-col items-center -mt-10">
              <Avatar 
                className="h-20 w-20 border-4 border-background cursor-pointer"
                onClick={() => handleUserClick(currentUser.id)}
              >
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="gradient-bg text-white text-xl">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 
                className="mt-2 font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleUserClick(currentUser.id)}
              >
                {currentUser.name}
              </h3>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
              <p className="text-sm text-center mt-2 text-muted-foreground line-clamp-2">
                {currentUser.bio}
              </p>
              <Separator className="my-4" />
              <div className="flex gap-6 text-center">
                <div>
                  <p className="font-semibold">{formatNumber(currentUser.followers.length)}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-semibold">{formatNumber(currentUser.following.length)}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Trending Now</h3>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div 
                  key={topic.tag} 
                  className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors -mx-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">{index + 1}</span>
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {topic.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Users */}
        {suggestedUsers.length > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Who to follow</h3>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <SuggestedUser 
                    key={user.id} 
                    user={user} 
                    onClick={() => handleUserClick(user.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-center px-4">
          <p>© 2026 SMEC App. All rights reserved.</p>
          <p className="mt-1">Made with 💜 for the hackathon</p>
        </div>
      </div>
    </aside>
  )
}

function SuggestedUser({ user, onClick }) {
  const { followUser, currentUser } = useStore()
  const isFollowing = currentUser.following.includes(user.id)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
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
              <Badge variant="secondary" className="h-4 px-1 text-[10px]">✓</Badge>
            )}
          </p>
          <p className="text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <Button
        variant={isFollowing ? 'outline' : 'gradient'}
        size="sm"
        className="h-8"
        onClick={(e) => {
          e.stopPropagation()
          followUser(user.id)
        }}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}
