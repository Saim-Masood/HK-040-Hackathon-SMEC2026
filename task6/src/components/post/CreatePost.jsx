import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@/store/useStore'
import { Image, X, Smile, MapPin, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const sampleImages = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1682687221038-404670f01d03?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=800&h=600&fit=crop',
]

export function CreatePost({ onPostCreated }) {
  const { currentUser, createPost } = useStore()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) return
    
    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    createPost(content.trim(), selectedImage)
    setContent('')
    setSelectedImage(null)
    setIsExpanded(false)
    setIsSubmitting(false)
    onPostCreated?.()
  }

  const handleAddRandomImage = () => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
    setSelectedImage(randomImage)
  }

  const characterCount = content.length
  const maxCharacters = 500
  const isOverLimit = characterCount > maxCharacters

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="gradient-bg text-white">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={cn(
                'min-h-[60px] border-none shadow-none resize-none focus-visible:ring-0 p-0 text-base',
                isExpanded && 'min-h-[100px]'
              )}
            />
            
            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Actions */}
            {(isExpanded || content || selectedImage) && (
              <div className="flex items-center justify-between pt-2 border-t animate-fade-in">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-primary hover:text-primary"
                    onClick={handleAddRandomImage}
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-primary">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-primary">
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-sm',
                    characterCount > maxCharacters * 0.9 && 'text-orange-500',
                    isOverLimit && 'text-destructive'
                  )}>
                    {characterCount}/{maxCharacters}
                  </span>
                  <Button
                    onClick={handleSubmit}
                    disabled={(!content.trim() && !selectedImage) || isOverLimit || isSubmitting}
                    variant="gradient"
                    className="px-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Posting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Post
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
