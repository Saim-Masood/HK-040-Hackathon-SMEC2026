import { useStore } from '@/store/useStore'
import { CreatePost } from '@/components/post/CreatePost'
import { PostCard } from '@/components/post/PostCard'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function FeedPage() {
  const { getFeedPosts, getExplorePosts, currentUser } = useStore()
  
  // Get feed posts, or explore posts if user doesn't follow anyone
  const feedPosts = getFeedPosts()
  const posts = feedPosts.length > 0 ? feedPosts : getExplorePosts()

  return (
    <div className="space-y-4">
      {/* Create Post */}
      <CreatePost />

      {/* Feed Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Your Feed</h2>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No posts in your feed yet. Start following people to see their posts!
          </p>
        </Card>
      )}
    </div>
  )
}
