import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { Search, CheckCircle2, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchPage() {
  const { searchUsers, users, followUser, currentUser, setSelectedProfile, setActiveView } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchUsers(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query, searchUsers])

  const handleUserClick = (user) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(u => u.id !== user.id)
      return [user, ...filtered].slice(0, 5)
    })
    setSelectedProfile(user.id)
    setActiveView('profile')
  }

  // Suggested users (verified users first)
  const suggestedUsers = users
    .filter(u => u.id !== currentUser.id)
    .sort((a, b) => {
      if (a.verified && !b.verified) return -1
      if (!a.verified && b.verified) return 1
      return b.followers.length - a.followers.length
    })
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="p-6 gradient-bg text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Search</h1>
            <p className="text-white/80">Find people, topics, and more</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-foreground bg-background"
          />
        </div>
      </Card>

      {/* Search Results */}
      {query && (
        <div className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Results
          </h2>
          {results.length > 0 ? (
            <div className="grid gap-3">
              {results.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onClick={() => handleUserClick(user)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No users found for "{query}"</p>
            </Card>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recent Searches
          </h2>
          <div className="grid gap-3">
            {recentSearches.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Users */}
      {!query && (
        <div className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Suggested for You
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {suggestedUsers.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UserCard({ user, onClick }) {
  const { followUser, currentUser } = useStore()
  const isFollowing = currentUser.following.includes(user.id)

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="gradient-bg text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold flex items-center gap-1">
                {user.name}
                {user.verified && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.followers.length} followers
              </p>
            </div>
          </div>
          <Button
            variant={isFollowing ? 'outline' : 'gradient'}
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              followUser(user.id)
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
        {user.bio && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {user.bio}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
