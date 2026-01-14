import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store/useStore'
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe,
  Camera,
  Save,
  Moon,
  Sun,
  Check,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const { currentUser, updateCurrentUser, theme, toggleTheme, setActiveView, setSelectedProfile } = useStore()
  const [formData, setFormData] = useState({
    name: currentUser.name,
    username: currentUser.username,
    email: currentUser.email,
    bio: currentUser.bio,
    location: currentUser.location,
    website: currentUser.website,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    updateCurrentUser(formData)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleViewProfile = () => {
    setSelectedProfile(currentUser.id)
    setActiveView('profile')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 gradient-bg text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/80">Manage your account and preferences</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and public information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="gradient-bg text-white text-2xl">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/200 characters
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={handleViewProfile}>
                  View Profile
                </Button>
                <Button 
                  variant="gradient" 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationToggle
                title="Push Notifications"
                description="Receive notifications on your device"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Email Notifications"
                description="Receive notifications via email"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="New Followers"
                description="When someone follows you"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Likes"
                description="When someone likes your post or comment"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Comments"
                description="When someone comments on your post"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Mentions"
                description="When someone mentions you"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Direct Messages"
                description="When you receive a new message"
                defaultChecked={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationToggle
                title="Private Account"
                description="Only approved followers can see your posts"
                defaultChecked={false}
              />
              <Separator />
              <NotificationToggle
                title="Activity Status"
                description="Show when you're active on SMEC"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Read Receipts"
                description="Show when you've read messages"
                defaultChecked={true}
              />
              <Separator />
              <NotificationToggle
                title="Two-Factor Authentication"
                description="Add an extra layer of security"
                defaultChecked={false}
              />
              <Separator />
              <div className="pt-4 space-y-3">
                <h4 className="font-medium">Danger Zone</h4>
                <div className="flex gap-3">
                  <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
                    Deactivate Account
                  </Button>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how SMEC looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card 
                    className={cn(
                      'cursor-pointer transition-all p-4',
                      theme === 'light' && 'ring-2 ring-primary'
                    )}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Sun className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Light</p>
                        <p className="text-xs text-muted-foreground">Clean and bright</p>
                      </div>
                    </div>
                    <div className="h-20 rounded-lg bg-white border flex items-center justify-center">
                      <div className="w-full px-3 space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className={cn(
                      'cursor-pointer transition-all p-4',
                      theme === 'dark' && 'ring-2 ring-primary'
                    )}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        <Moon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Dark</p>
                        <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                      </div>
                    </div>
                    <div className="h-20 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                      <div className="w-full px-3 space-y-2">
                        <div className="h-2 bg-gray-700 rounded w-3/4" />
                        <div className="h-2 bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Accent Color</h4>
                <div className="flex gap-3">
                  {[
                    { name: 'Violet', color: 'bg-violet-500', active: true },
                    { name: 'Blue', color: 'bg-blue-500', active: false },
                    { name: 'Green', color: 'bg-green-500', active: false },
                    { name: 'Orange', color: 'bg-orange-500', active: false },
                    { name: 'Pink', color: 'bg-pink-500', active: false },
                  ].map(accent => (
                    <button
                      key={accent.name}
                      className={cn(
                        'h-10 w-10 rounded-full transition-all',
                        accent.color,
                        accent.active && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      title={accent.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationToggle({ title, description, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'gradient-bg' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  )
}
