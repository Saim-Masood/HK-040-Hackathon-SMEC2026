import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Compass,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { currentUser, activeView, setActiveView, setSelectedProfile, theme, toggleTheme } = useStore()

  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setActiveView('feed')}
        >
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="hidden sm:block text-xl font-bold gradient-text">SMEC</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeView === item.id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      'h-10 w-10',
                      activeView === item.id && 'gradient-bg'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="gradient-bg text-white">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{currentUser.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedProfile(currentUser.id)
                  setActiveView('profile')
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="md:hidden flex items-center justify-around border-t py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveView(item.id)}
            className={cn(
              'h-10 w-10',
              activeView === item.id && 'gradient-bg'
            )}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        ))}
      </nav>
    </header>
  )
}
