import { useStore } from '@/store/useStore'
import { PostCard } from '@/components/post/PostCard'
import { Card } from '@/components/ui/card'
import { Compass, TrendingUp, Flame } from 'lucide-react'

export function ExplorePage() {
  const { getExplorePosts } = useStore()
  const posts = getExplorePosts()

  return (
    <div className="space-y-4">
      {/* Explore Header */}
      <Card className="p-6 gradient-bg text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Compass className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Explore</h1>
            <p className="text-white/80">Discover trending posts and popular content</p>
          </div>
        </div>
      </Card>

      {/* Trending Section */}
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        <h2 className="font-semibold">Trending Posts</h2>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No posts to explore yet.
          </p>
        </Card>
      )}
    </div>
  )
}
