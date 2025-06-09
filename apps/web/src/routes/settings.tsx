import { Component, createSignal } from "solid-js"
import { Card } from "../components/ui"
import { Button } from "../components/ui"
import { Input, Select } from "../components/ui"
import { Settings, User, Bell, Shield, Palette, Database } from "lucide-solid"

const SettingsPage: Component = () => {
  const [notifications, setNotifications] = createSignal({
    email: true,
    push: true,
    desktop: false,
    tasks: true,
    projects: true,
    deadlines: true
  })

  const [profile, setProfile] = createSignal({
    name: "John Doe",
    email: "john.doe@velocityfibre.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en"
  })

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const updateNotification = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const saveSettings = () => {
    alert("Settings saved! (Demo mode - changes are temporary)")
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Settings</h1>
            <p class="ff-page-subtitle">Manage your account preferences and application settings</p>
          </div>
          <Button onClick={saveSettings} class="bg-primary text-primary-foreground">
            Save Changes
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card class="p-6 ff-card">
          <div class="flex items-center gap-3 mb-6">
            <User class="w-5 h-5 text-primary" />
            <h2 class="ff-section-title mb-0">Profile Settings</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="ff-label mb-2 block">Full Name</label>
              <Input
                value={profile().name}
                onInput={(e) => updateProfile("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label class="ff-label mb-2 block">Email Address</label>
              <Input
                type="email"
                value={profile().email}
                onInput={(e) => updateProfile("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label class="ff-label mb-2 block">Phone Number</label>
              <Input
                type="tel"
                value={profile().phone}
                onInput={(e) => updateProfile("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label class="ff-label mb-2 block">Timezone</label>
              <Select
                value={profile().timezone}
                onChange={(value) => updateProfile("timezone", value)}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </Select>
            </div>

            <div>
              <label class="ff-label mb-2 block">Language</label>
              <Select
                value={profile().language}
                onChange={(value) => updateProfile("language", value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card class="p-6 ff-card">
          <div class="flex items-center gap-3 mb-6">
            <Bell class="w-5 h-5 text-primary" />
            <h2 class="ff-section-title mb-0">Notification Preferences</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Email Notifications</h4>
                <p class="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().email}
                onChange={(e) => updateNotification("email", e.target.checked)}
                class="w-4 h-4"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Push Notifications</h4>
                <p class="text-sm text-muted-foreground">Mobile and web push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().push}
                onChange={(e) => updateNotification("push", e.target.checked)}
                class="w-4 h-4"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Desktop Notifications</h4>
                <p class="text-sm text-muted-foreground">Show desktop alerts</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().desktop}
                onChange={(e) => updateNotification("desktop", e.target.checked)}
                class="w-4 h-4"
              />
            </div>

            <hr class="border-border" />

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Task Updates</h4>
                <p class="text-sm text-muted-foreground">Notifications for task changes</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().tasks}
                onChange={(e) => updateNotification("tasks", e.target.checked)}
                class="w-4 h-4"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Project Updates</h4>
                <p class="text-sm text-muted-foreground">Notifications for project changes</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().projects}
                onChange={(e) => updateNotification("projects", e.target.checked)}
                class="w-4 h-4"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-card-foreground">Deadline Reminders</h4>
                <p class="text-sm text-muted-foreground">Alerts for approaching deadlines</p>
              </div>
              <input
                type="checkbox"
                checked={notifications().deadlines}
                onChange={(e) => updateNotification("deadlines", e.target.checked)}
                class="w-4 h-4"
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card class="p-6 ff-card">
          <div class="flex items-center gap-3 mb-6">
            <Palette class="w-5 h-5 text-primary" />
            <h2 class="ff-section-title mb-0">Appearance</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="ff-label mb-2 block">Theme</label>
              <Select value="system">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
            </div>

            <div>
              <label class="ff-label mb-2 block">Display Density</label>
              <Select value="comfortable">
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </Select>
            </div>

            <div>
              <label class="ff-label mb-2 block">Sidebar</label>
              <Select value="expanded">
                <option value="collapsed">Collapsed by default</option>
                <option value="expanded">Expanded by default</option>
                <option value="auto">Auto (responsive)</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card class="p-6 ff-card">
          <div class="flex items-center gap-3 mb-6">
            <Shield class="w-5 h-5 text-primary" />
            <h2 class="ff-section-title mb-0">Security</h2>
          </div>

          <div class="space-y-4">
            <div>
              <Button variant="outline" class="w-full">
                Change Password
              </Button>
            </div>

            <div>
              <Button variant="outline" class="w-full">
                Enable Two-Factor Authentication
              </Button>
            </div>

            <div>
              <Button variant="outline" class="w-full">
                View Login Activity
              </Button>
            </div>

            <div>
              <Button variant="outline" class="w-full">
                Download Account Data
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <Card class="p-6 ff-card mt-6">
        <div class="flex items-center gap-3 mb-6">
          <Database class="w-5 h-5 text-primary" />
          <h2 class="ff-section-title mb-0">Data Management</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline">
            Export Projects Data
          </Button>
          <Button variant="outline">
            Export Tasks Data
          </Button>
          <Button variant="outline" class="text-red-600 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPage