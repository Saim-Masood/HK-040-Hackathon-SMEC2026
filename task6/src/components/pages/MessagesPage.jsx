import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
import { formatDate, cn } from '@/lib/utils'
import { 
  MessageCircle, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  CheckCircle2,
  ImageIcon,
  Smile,
  Paperclip
} from 'lucide-react'

// Mock conversations
const mockConversations = [
  {
    id: 1,
    participantId: 'user2',
    messages: [
      { id: 1, senderId: 'user2', content: 'Hey! Love your latest post about the new feature launch!', createdAt: '2026-01-14T09:30:00Z' },
      { id: 2, senderId: 'user1', content: 'Thanks Sarah! Took us a while but really happy with how it turned out.', createdAt: '2026-01-14T09:32:00Z' },
      { id: 3, senderId: 'user2', content: 'Would love to collaborate on the UI for the next version!', createdAt: '2026-01-14T09:35:00Z' },
    ],
    unread: 1,
    lastActivity: '2026-01-14T09:35:00Z',
  },
  {
    id: 2,
    participantId: 'user4',
    messages: [
      { id: 1, senderId: 'user4', content: 'Those Tokyo photos are incredible! What camera do you use?', createdAt: '2026-01-13T14:20:00Z' },
      { id: 2, senderId: 'user1', content: 'Thanks Emily! I use a Sony A7III for most of my shots.', createdAt: '2026-01-13T14:25:00Z' },
    ],
    unread: 0,
    lastActivity: '2026-01-13T14:25:00Z',
  },
  {
    id: 3,
    participantId: 'user3',
    messages: [
      { id: 1, senderId: 'user3', content: 'Great workout tips! Mind sharing your routine?', createdAt: '2026-01-12T10:00:00Z' },
    ],
    unread: 0,
    lastActivity: '2026-01-12T10:00:00Z',
  },
]

export function MessagesPage() {
  const { getUserById, currentUser, setSelectedProfile, setActiveView } = useStore()
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    }

    setConversations(conversations.map(c => 
      c.id === selectedConversation.id 
        ? { ...c, messages: [...c.messages, newMsg], lastActivity: newMsg.createdAt }
        : c
    ))

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
    })

    setNewMessage('')
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    // Mark as read
    setConversations(conversations.map(c =>
      c.id === conversation.id ? { ...c, unread: 0 } : c
    ))
  }

  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true
    const participant = getUserById(c.participantId)
    return participant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           participant?.username.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full overflow-hidden">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={cn(
            'w-full md:w-80 border-r flex flex-col',
            selectedConversation && 'hidden md:flex'
          )}>
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Messages
                  {totalUnread > 0 && (
                    <Badge variant="gradient">{totalUnread}</Badge>
                  )}
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map(conversation => {
                  const participant = getUserById(conversation.participantId)
                  const lastMessage = conversation.messages[conversation.messages.length - 1]
                  if (!participant) return null

                  return (
                    <div
                      key={conversation.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                        selectedConversation?.id === conversation.id 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted'
                      )}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback className="gradient-bg text-white">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm flex items-center gap-1">
                            {participant.name}
                            {participant.verified && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(conversation.lastActivity)}
                          </span>
                        </div>
                        <p className={cn(
                          'text-sm truncate',
                          conversation.unread > 0 ? 'font-medium' : 'text-muted-foreground'
                        )}>
                          {lastMessage.senderId === currentUser.id && 'You: '}
                          {lastMessage.content}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="gradient" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={cn(
            'flex-1 flex flex-col',
            !selectedConversation && 'hidden md:flex'
          )}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <ChatHeader 
                  conversation={selectedConversation} 
                  onBack={() => setSelectedConversation(null)}
                  onProfileClick={() => {
                    setSelectedProfile(selectedConversation.participantId)
                    setActiveView('profile')
                  }}
                />

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message, index) => {
                      const isOwn = message.senderId === currentUser.id
                      const sender = getUserById(message.senderId)
                      const showAvatar = index === 0 || 
                        selectedConversation.messages[index - 1].senderId !== message.senderId

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-2',
                            isOwn && 'flex-row-reverse'
                          )}
                        >
                          {!isOwn && showAvatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sender?.avatar} />
                              <AvatarFallback className="gradient-bg text-white text-xs">
                                {sender?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {!isOwn && !showAvatar && <div className="w-8" />}
                          <div
                            className={cn(
                              'max-w-[70%] px-4 py-2 rounded-2xl',
                              isOwn 
                                ? 'gradient-bg text-white rounded-br-none' 
                                : 'bg-muted rounded-bl-none'
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={cn(
                              'text-[10px] mt-1',
                              isOwn ? 'text-white/70' : 'text-muted-foreground'
                            )}>
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="submit" 
                      variant="gradient" 
                      size="icon"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="h-20 w-20 rounded-full gradient-bg mx-auto flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                  <p className="text-muted-foreground">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function ChatHeader({ conversation, onBack, onProfileClick }) {
  const { getUserById } = useStore()
  const participant = getUserById(conversation.participantId)

  if (!participant) return null

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onBack}
        >
          ←
        </Button>
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={onProfileClick}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="gradient-bg text-white">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold flex items-center gap-1">
              {participant.name}
              {participant.verified && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
            </p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
