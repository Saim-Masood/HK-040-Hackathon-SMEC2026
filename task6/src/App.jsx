import { useStore } from '@/store/useStore'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { FeedPage } from '@/components/pages/FeedPage'
import { ExplorePage } from '@/components/pages/ExplorePage'
import { SearchPage } from '@/components/pages/SearchPage'
import { NotificationsPage } from '@/components/pages/NotificationsPage'
import { MessagesPage } from '@/components/pages/MessagesPage'
import { SettingsPage } from '@/components/pages/SettingsPage'
import { ProfilePage } from '@/components/profile/ProfilePage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'

function App() {
  const { activeView } = useStore()

  const renderPage = () => {
    switch (activeView) {
      case 'feed':
        return <FeedPage />
      case 'explore':
        return <ExplorePage />
      case 'search':
        return <SearchPage />
      case 'notifications':
        return <NotificationsPage />
      case 'messages':
        return <MessagesPage />
      case 'settings':
        return <SettingsPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <FeedPage />
    }
  }

  const showSidebar = !['messages', 'settings'].includes(activeView)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        
        <div className="container px-4 md:px-8 py-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {renderPage()}
            </main>

            {/* Sidebar */}
            {showSidebar && <Sidebar />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App
