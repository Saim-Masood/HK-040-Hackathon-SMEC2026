import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { UserProvider } from '@/context/UserContext'
import { Layout } from '@/components/Layout'
import Home from '@/pages/Home'
import Scan from '@/pages/Scan'
import Friends from '@/pages/Friends'
import Profile from '@/pages/Profile'

function AppContent() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  )
}

export default App
