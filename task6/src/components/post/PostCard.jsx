import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/store/useStore'
import { formatDate, formatNumber, cn } from '@/lib/utils'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Trash2,
  Flag,
  Link2,
  CheckCircle2
} from 'lucide-react'
import { CommentSection } from './CommentSection'

export function PostCard({ post }) {
  const { 
    currentUser, 
    getUserById, 
    likePost, 
    deletePost,
    setSelectedProfile,
    setActiveView
  } = useStore()
  
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const author = getUserById(post.userId)
  const isLiked = post.likes.includes(currentUser.id)
  const isOwnPost = post.userId === currentUser.id

  const handleLike = async () => {
    setIsLiking(true)
    likePost(post.id)
    setTimeout(() => setIsLiking(false), 300)
  }

  const handleProfileClick = () => {
    setSelectedProfile(author.id)
    setActiveView('profile')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post on SMEC!`)
  }

  if (!author) return null

  return (
    <Card className="overflow-hidden animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar 
              className="h-11 w-11 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all"
              onClick={handleProfileClick}
            >
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="gradient-bg text-white">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold hover:text-primary cursor-pointer transition-colors"
                  onClick={handleProfileClick}
                >
                  {author.name}
                </span>
                {author.verified && (
                  <Badge variant="secondary" className="h-5 px-1.5 gap-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span className="text-[10px]">Verified</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span 
                  className="hover:text-primary cursor-pointer transition-colors"
                  onClick={handleProfileClick}
                >
                  @{author.username}
                </span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Link2 className="mr-2 h-4 w-4" />
                Copy link
              </DropdownMenuItem>
              {isOwnPost ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete post
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Flag className="mr-2 h-4 w-4" />
                    Report post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img 
              src={post.image} 
              alt="Post content"
              className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>
      
      {/* Engagement Stats */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="px-6 pb-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {post.likes.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-5 w-5 rounded-full gradient-bg flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white fill-white" />
                </span>
                {formatNumber(post.likes.length)} {post.likes.length === 1 ? 'like' : 'likes'}
              </span>
            )}
            {post.comments.length > 0 && (
              <span 
                className="hover:underline cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {formatNumber(post.comments.length)} {post.comments.length === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      )}
      
      <Separator />
      
      <CardFooter className="py-1 px-2">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              'flex-1 gap-2 transition-all',
              isLiked && 'text-pink-500 hover:text-pink-600',
              isLiking && 'animate-pulse-heart'
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex-1 gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex-1 gap-2"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={cn('flex-1 gap-2', isSaved && 'text-primary')}
          >
            <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </CardFooter>
      
      {/* Comments Section */}
      {showComments && (
        <>
          <Separator />
          <CommentSection post={post} />
        </>
      )}
    </Card>
  )
}
