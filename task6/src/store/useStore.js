import { create } from 'zustand'
import { generateId } from '@/lib/utils'
import { mockUsers, mockPosts } from '@/data/mockData'

export const useStore = create((set, get) => ({
  // Current user (logged in user)
  currentUser: mockUsers[0],
  
  // All users
  users: mockUsers,
  
  // All posts
  posts: mockPosts,
  
  // Active view/page
  activeView: 'feed',
  
  // Selected profile (for viewing other profiles)
  selectedProfile: null,
  
  // Theme
  theme: 'light',
  
  // Actions
  setActiveView: (view) => set({ activeView: view }),
  
  setSelectedProfile: (userId) => {
    const user = get().users.find(u => u.id === userId) || null
    set({ selectedProfile: user })
  },
  
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    set({ theme: newTheme })
  },
  
  // User actions
  updateCurrentUser: (updates) => set((state) => ({
    currentUser: { ...state.currentUser, ...updates },
    users: state.users.map(u => 
      u.id === state.currentUser.id ? { ...u, ...updates } : u
    )
  })),
  
  followUser: (userId) => set((state) => {
    const isFollowing = state.currentUser.following.includes(userId)
    const newFollowing = isFollowing
      ? state.currentUser.following.filter(id => id !== userId)
      : [...state.currentUser.following, userId]
    
    const updatedUsers = state.users.map(u => {
      if (u.id === state.currentUser.id) {
        return { ...u, following: newFollowing }
      }
      if (u.id === userId) {
        const newFollowers = isFollowing
          ? u.followers.filter(id => id !== state.currentUser.id)
          : [...u.followers, state.currentUser.id]
        return { ...u, followers: newFollowers }
      }
      return u
    })
    
    return {
      currentUser: { ...state.currentUser, following: newFollowing },
      users: updatedUsers,
      selectedProfile: state.selectedProfile?.id === userId 
        ? updatedUsers.find(u => u.id === userId) 
        : state.selectedProfile
    }
  }),
  
  // Post actions
  createPost: (content, image = null) => set((state) => {
    const newPost = {
      id: generateId(),
      userId: state.currentUser.id,
      content,
      image,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    }
    return { posts: [newPost, ...state.posts] }
  }),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(p => p.id !== postId)
  })),
  
  likePost: (postId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id !== postId) return post
      const isLiked = post.likes.includes(state.currentUser.id)
      return {
        ...post,
        likes: isLiked
          ? post.likes.filter(id => id !== state.currentUser.id)
          : [...post.likes, state.currentUser.id]
      }
    })
  })),
  
  // Comment actions
  addComment: (postId, content) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id !== postId) return post
      const newComment = {
        id: generateId(),
        userId: state.currentUser.id,
        content,
        likes: [],
        createdAt: new Date().toISOString(),
      }
      return { ...post, comments: [...post.comments, newComment] }
    })
  })),
  
  deleteComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id !== postId) return post
      return {
        ...post,
        comments: post.comments.filter(c => c.id !== commentId)
      }
    })
  })),
  
  likeComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id !== postId) return post
      return {
        ...post,
        comments: post.comments.map(comment => {
          if (comment.id !== commentId) return comment
          const isLiked = comment.likes.includes(state.currentUser.id)
          return {
            ...comment,
            likes: isLiked
              ? comment.likes.filter(id => id !== state.currentUser.id)
              : [...comment.likes, state.currentUser.id]
          }
        })
      }
    })
  })),
  
  // Search
  searchUsers: (query) => {
    const users = get().users
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    return users.filter(u => 
      u.name.toLowerCase().includes(lowerQuery) ||
      u.username.toLowerCase().includes(lowerQuery)
    )
  },
  
  // Get user by ID
  getUserById: (userId) => get().users.find(u => u.id === userId),
  
  // Get posts by user ID
  getPostsByUserId: (userId) => get().posts.filter(p => p.userId === userId),
  
  // Get feed posts (posts from following + own posts)
  getFeedPosts: () => {
    const state = get()
    const following = state.currentUser.following
    return state.posts.filter(p => 
      p.userId === state.currentUser.id || following.includes(p.userId)
    )
  },
  
  // Get explore posts (all posts sorted by likes)
  getExplorePosts: () => {
    return get().posts.sort((a, b) => b.likes.length - a.likes.length)
  },
}))
