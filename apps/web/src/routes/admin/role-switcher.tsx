import { Component, createSignal } from "solid-js"
import { Card, Button, Select } from "../../components/ui"
import { Users, RefreshCw, Eye } from "lucide-solid"
import type { UserRole } from "../../types"

const RoleSwitcherPage: Component = () => {
  const [selectedRole, setSelectedRole] = createSignal<UserRole>("admin")
  
  const roles: { value: UserRole, label: string, description: string }[] = [
    { 
      value: "admin", 
      label: "Administrator", 
      description: "Full system access - can manage all projects, users, and settings" 
    },
    { 
      value: "project_manager", 
      label: "Project Manager", 
      description: "Can manage assigned projects, tasks, and team members" 
    },
    { 
      value: "field_technician", 
      label: "Field Technician", 
      description: "Can view assigned tasks only, update task progress" 
    },
    { 
      value: "design_engineer", 
      label: "Design Engineer", 
      description: "Can view projects, manage design tasks, create technical documentation" 
    },
    { 
      value: "client", 
      label: "Client", 
      description: "Can view project progress, reports, and communicate with team" 
    }
  ]

  const switchRole = () => {
    // In a real app, this would update the user context
    // For now, we'll just reload the page with a URL parameter
    const newUrl = `${window.location.origin}?role=${selectedRole()}`
    window.location.href = newUrl
  }

  const getCurrentRole = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('role') || 'admin'
  }

  const getNavigationPreview = (role: UserRole) => {
    const navigationConfig = {
      admin: ["Dashboard", "Projects", "Tasks", "Users", "Reports", "Settings"],
      project_manager: ["Dashboard", "My Projects", "Tasks", "Team", "Reports", "Settings"],
      field_technician: ["Dashboard", "My Tasks", "My Projects", "Time Tracking", "Reports"],
      design_engineer: ["Dashboard", "My Tasks", "Projects", "Calendar", "Reports"],
      client: ["Dashboard", "My Projects", "Progress Reports", "Support"]
    }
    return navigationConfig[role] || []
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Role Switcher</h1>
            <p class="ff-page-subtitle">Test different user role perspectives and navigation</p>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
            <Users class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-medium text-blue-800">Current: {getCurrentRole()}</span>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <Card class="p-6 ff-card mb-6">
        <h2 class="ff-section-title mb-4">Switch User Role</h2>
        <p class="text-muted-foreground mb-6">
          Select a role to see how the application appears for different user types. 
          This will reload the page with the selected role perspective.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="ff-label mb-2 block">Select Role</label>
            <Select value={selectedRole()} onChange={(value) => setSelectedRole(value as UserRole)}>
              {roles.map(role => (
                <option value={role.value}>{role.label}</option>
              ))}
            </Select>
            <p class="text-sm text-muted-foreground mt-2">
              {roles.find(r => r.value === selectedRole())?.description}
            </p>
          </div>
          
          <div class="flex items-end">
            <Button onClick={switchRole} class="bg-primary text-primary-foreground">
              <RefreshCw class="w-4 h-4 mr-2" />
              Switch to {roles.find(r => r.value === selectedRole())?.label}
            </Button>
          </div>
        </div>
      </Card>

      {/* Role Comparison */}
      <section class="ff-section">
        <h2 class="ff-section-title">Role Navigation Preview</h2>
        <p class="text-muted-foreground mb-6">
          Here's what each role sees in their sidebar navigation:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <Card class={`p-6 ff-card ${getCurrentRole() === role.value ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
              <div class="flex items-center gap-3 mb-4">
                <Users class="w-5 h-5 text-primary" />
                <div>
                  <h3 class="font-semibold text-card-foreground">{role.label}</h3>
                  {getCurrentRole() === role.value && (
                    <span class="text-xs text-primary font-medium">CURRENT ROLE</span>
                  )}
                </div>
              </div>
              
              <p class="text-sm text-muted-foreground mb-4">{role.description}</p>
              
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-card-foreground">Navigation Items:</h4>
                <ul class="space-y-1">
                  {getNavigationPreview(role.value).map(item => (
                    <li class="text-sm text-muted-foreground flex items-center gap-2">
                      <div class="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div class="mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  class="w-full"
                  onClick={() => {
                    setSelectedRole(role.value)
                    switchRole()
                  }}
                  disabled={getCurrentRole() === role.value}
                >
                  <Eye class="w-3 h-3 mr-2" />
                  {getCurrentRole() === role.value ? 'Current Role' : `View as ${role.label}`}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <Card class="p-6 ff-card mt-6">
        <h3 class="font-semibold text-card-foreground mb-3">How to Use</h3>
        <ol class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">1</span>
            Select a role from the dropdown above
          </li>
          <li class="flex items-start gap-2">
            <span class="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">2</span>
            Click "Switch to [Role]" button to reload with that role's perspective
          </li>
          <li class="flex items-start gap-2">
            <span class="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">3</span>
            Observe the sidebar navigation changes and available menu items
          </li>
          <li class="flex items-start gap-2">
            <span class="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">4</span>
            Test different pages to see role-based content filtering
          </li>
          <li class="flex items-start gap-2">
            <span class="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">5</span>
            Return to admin role to access this role switcher again
          </li>
        </ol>
      </Card>
    </div>
  )
}

export default RoleSwitcherPage