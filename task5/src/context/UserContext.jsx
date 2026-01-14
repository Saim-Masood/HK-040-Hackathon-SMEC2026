import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user or creating one if not exists
    const storedUser = localStorage.getItem('qr_app_user')
    const storedFriends = localStorage.getItem('qr_app_friends')

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    } else {
      const newUser = {
        id: uuidv4(),
        name: 'Guest User', // Simple default for now
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Date.now()}`,
        joinedAt: new Date().toISOString()
      }
      setCurrentUser(newUser)
      localStorage.setItem('qr_app_user', JSON.stringify(newUser))
    }

    if (storedFriends) {
      setFriends(JSON.parse(storedFriends))
    }

    setLoading(false)
  }, [])

  const addFriend = (friendData) => {
    if (friends.some(f => f.id === friendData.id)) {
      return { success: false, message: 'Already friends!' }
    }
    if (friendData.id === currentUser.id) {
      return { success: false, message: 'You cannot be friends with yourself!' }
    }

    const newFriends = [...friends, { ...friendData, connectedAt: new Date().toISOString() }]
    setFriends(newFriends)
    localStorage.setItem('qr_app_friends', JSON.stringify(newFriends))
    return { success: true, message: 'Friend connected!' }
  }

  const updateProfile = (name) => {
    const updatedUser = { ...currentUser, name }
    setCurrentUser(updatedUser)
    localStorage.setItem('qr_app_user', JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ currentUser, friends, loading, addFriend, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
