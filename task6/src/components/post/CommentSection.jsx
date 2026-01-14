import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store/useStore'
import { formatDate, cn } from '@/lib/utils'
import { Heart, Trash2, Send } from 'lucide-react'

export function CommentSection({ post }) {
  const { 
    currentUser, 
    getUserById, 
    addComment, 
    deleteComment, 
    likeComment,
    setSelectedProfile,
    setActiveView 
  } = useStore()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    addComment(post.id, newComment.trim())
    setNewComment('')
    setIsSubmitting(false)
  }

  const handleProfileClick = (userId) => {
    setSelectedProfile(userId)
    setActiveView('profile')
  }

  return (
    <div className="p-4 space-y-4 bg-muted/30">
      {/* Add comment */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="gradient-bg text-white text-sm">
            {currentUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-background"
          />
          <Button 
            type="submit" 
            variant="gradient" 
            size="icon"
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {post.comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            onProfileClick={handleProfileClick}
          />
        ))}
      </div>
    </div>
  )
}

function Comment({ comment, postId, onProfileClick }) {
  const { currentUser, getUserById, deleteComment, likeComment } = useStore()
  const author = getUserById(comment.userId)
  const isLiked = comment.likes.includes(currentUser.id)
  const isOwnComment = comment.userId === currentUser.id

  if (!author) return null

  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar 
        className="h-8 w-8 cursor-pointer"
        onClick={() => onProfileClick(author.id)}
      >
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="gradient-bg text-white text-xs">
          {author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-background rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span 
              className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => onProfileClick(author.id)}
            >
              {author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2">
          <button
            onClick={() => likeComment(postId, comment.id)}
            className={cn(
              'text-xs font-medium transition-colors',
              isLiked ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isLiked ? 'Liked' : 'Like'} {comment.likes.length > 0 && `(${comment.likes.length})`}
          </button>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Reply
          </button>
          {isOwnComment && (
            <button
              onClick={() => deleteComment(postId, comment.id)}
              className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
