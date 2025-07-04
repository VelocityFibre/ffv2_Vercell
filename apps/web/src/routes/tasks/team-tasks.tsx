import { Component, createSignal, Show, For } from "solid-js"
import { Input, Select } from "../../components/ui"
import { mockAPI } from "../../lib/mockData"
import { Button } from "../../components/ui"
import { Card } from "../../components/ui"
import { Badge } from "../../components/ui"
import { CheckSquare, Calendar, User, Filter, Users } from "lucide-solid"

const TeamTasksPage: Component = () => {
  const [allTasks] = createSignal(mockAPI.getAllTasks() || [])
  const [searchTerm, setSearchTerm] = createSignal("")
  const [assigneeFilter, setAssigneeFilter] = createSignal("all")
  const [statusFilter, setStatusFilter] = createSignal("all")
  
  const users = mockAPI.getAllUsers()
  const projects = mockAPI.getAllProjects()

  const filteredTasks = () => {
    let tasks = allTasks()
    
    // Filter by assignee
    if (assigneeFilter() !== "all") {
      tasks = tasks.filter(t => t.assigneeId === assigneeFilter())
    }
    
    // Filter by status
    if (statusFilter() !== "all") {
      tasks = tasks.filter(t => t.status === statusFilter())
    }
    
    // Filter by search term
    const term = searchTerm().toLowerCase()
    if (term) {
      tasks = tasks.filter(t => 
        t.taskName.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      )
    }
    
    return tasks
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "blocked": return "bg-red-100 text-red-800"
      case "not_started": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || "Unassigned"
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  const groupedTasks = () => {
    const grouped: Record<string, typeof allTasks> = {}
    filteredTasks().forEach(task => {
      const assignee = task.assigneeId || "unassigned"
      if (!grouped[assignee]) {
        grouped[assignee] = []
      }
      grouped[assignee].push(task)
    })
    return grouped
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Team Tasks</h1>
            <p class="ff-page-subtitle">View tasks organized by team member assignments</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchTerm()}
          onInput={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          value={assigneeFilter()}
          onChange={setAssigneeFilter}
        >
          <option value="all">All Team Members</option>
          <For each={users}>
            {(user) => (
              <option value={user.id}>{user.name}</option>
            )}
          </For>
          <option value="unassigned">Unassigned</option>
        </Select>

        <Select
          value={statusFilter()}
          onChange={setStatusFilter}
        >
          <option value="all">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </Select>

        <Button variant="outline" class="flex items-center gap-2">
          <Filter class="w-4 h-4" />
          More Filters
        </Button>
      </div>

      <section class="ff-section">
        <h2 class="ff-section-title">Team Tasks ({filteredTasks().length})</h2>
        
        <div class="space-y-8">
          <For each={Object.keys(groupedTasks())}>
            {(assigneeId) => {
              const assigneeTasks = groupedTasks()[assigneeId]
              const assigneeName = assigneeId === "unassigned" ? "Unassigned Tasks" : getUserName(assigneeId)
              
              return (
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <User class="w-5 h-5 text-muted-foreground" />
                    <h3 class="ff-heading-medium text-card-foreground">
                      {assigneeName} ({assigneeTasks.length})
                    </h3>
                  </div>
                  
                  <div class="space-y-3">
                    <For each={assigneeTasks}>
                      {(task) => (
                        <Card class="p-4 ff-card">
                          <div class="flex items-start justify-between">
                            <div class="flex-1">
                              <div class="flex items-center gap-3 mb-2">
                                <h4 class="font-semibold text-card-foreground">{task.taskName}</h4>
                                <Badge class={getStatusColor(task.status)}>
                                  {task.status.replace("_", " ")}
                                </Badge>
                                <Badge class={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              
                              <Show when={task.description}>
                                <p class="text-muted-foreground text-sm mb-2">{task.description}</p>
                              </Show>
                              
                              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Project: {getProjectName(task.projectId)}</span>
                                <span>Phase: {task.phaseId}</span>
                                <span>Progress: {task.completionPercentage}%</span>
                              </div>
                            </div>
                            
                            <div class="flex gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                Reassign
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

        <Show when={filteredTasks().length === 0}>
          <Card class="p-12 text-center ff-card">
            <Users class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="ff-heading-medium text-card-foreground mb-2">No team tasks found</h3>
            <p class="text-muted-foreground mb-6">
              {searchTerm() || assigneeFilter() !== "all" || statusFilter() !== "all" 
                ? "No tasks match your current filters" 
                : "No tasks have been assigned to team members yet"}
            </p>
          </Card>
        </Show>
      </section>
    </div>
  )
}

export default TeamTasksPage