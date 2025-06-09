import { Component, createSignal, Show, For } from "solid-js"
import { Input } from "../components/ui"
import { mockAPI } from "../lib/mockData"
import { Button } from "../components/ui"
import { Card } from "../components/ui"
import { Badge } from "../components/ui"
import { Users, User, Mail, Phone, Calendar } from "lucide-solid"

const TeamPage: Component = () => {
  const [users] = createSignal(mockAPI.getAllUsers() || [])
  const [searchTerm, setSearchTerm] = createSignal("")

  const filteredUsers = () => {
    const term = searchTerm().toLowerCase()
    if (!term) return users()
    return users().filter(u => 
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800"
      case "project_manager": return "bg-purple-100 text-purple-800"
      case "team_lead": return "bg-blue-100 text-blue-800"
      case "design_engineer": return "bg-green-100 text-green-800"
      case "field_technician": return "bg-orange-100 text-orange-800"
      case "client": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatRole = (role: string) => {
    return role.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  const groupedUsers = () => {
    const grouped: Record<string, typeof users> = {}
    filteredUsers().forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  }

  const roleOrder = ["admin", "project_manager", "team_lead", "design_engineer", "field_technician", "client"]

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Team Members</h1>
            <p class="ff-page-subtitle">View and manage team members across all projects</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <Input
          placeholder="Search team members..."
          value={searchTerm()}
          onInput={(e) => setSearchTerm(e.target.value)}
          class="max-w-md"
        />
      </div>

      <section class="ff-section">
        <h2 class="ff-section-title">All Team Members ({filteredUsers().length})</h2>
        
        <div class="space-y-8">
          <For each={roleOrder.filter(role => groupedUsers()[role]?.length > 0)}>
            {(role) => {
              const roleUsers = groupedUsers()[role]
              const roleIcon = role === "admin" ? Users : User
              
              return (
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <Users class="w-5 h-5 text-muted-foreground" />
                    <h3 class="ff-heading-medium text-card-foreground">
                      {formatRole(role)} ({roleUsers.length})
                    </h3>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For each={roleUsers}>
                      {(user) => (
                        <Card class="p-4 ff-card">
                          <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                <User class="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 class="font-semibold text-card-foreground">{user.name}</h4>
                                <p class="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail class="w-3 h-3" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div class="flex items-center justify-between">
                            <Badge class={getRoleColor(user.role)}>
                              {formatRole(user.role)}
                            </Badge>
                            <div class="flex gap-1">
                              <Button size="sm" variant="outline">
                                Contact
                              </Button>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </For>
                  </div>
                </div>
              )
            }}
          </For>
        </div>

        <Show when={filteredUsers().length === 0}>
          <Card class="p-12 text-center ff-card">
            <Users class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="ff-heading-medium text-card-foreground mb-2">No team members found</h3>
            <p class="text-muted-foreground mb-6">
              {searchTerm() ? `No team members match "${searchTerm()}"` : "No team members available"}
            </p>
          </Card>
        </Show>
      </section>
    </div>
  )
}

export default TeamPage