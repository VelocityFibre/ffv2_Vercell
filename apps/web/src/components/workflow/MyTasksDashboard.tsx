import { Component, createSignal, createResource, For, Show } from "solid-js"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Calendar, Clock, AlertTriangle, CheckCircle, Play } from "lucide-solid"
import type { TaskWithProject, User, UserRole } from "../../lib/types"

interface MyTasksDashboardProps {
  currentUser: User
}

export const MyTasksDashboard: Component<MyTasksDashboardProps> = (props) => {
  const [selectedFilter, setSelectedFilter] = createSignal<'all' | 'overdue' | 'due_today' | 'in_progress'>('all')
  
  // Fetch tasks based on user role
  const [myTasks] = createResource(
    () => props.currentUser,
    async (user) => {
      const response = await fetch(`/api/tasks/my-tasks?userId=${user.id}&role=${user.role}`)
      const data = await response.json()
      return data.data as TaskWithProject[]
    }
  )

  const filteredTasks = () => {
    const tasks = myTasks() || []
    const filter = selectedFilter()
    
    if (filter === 'all') return tasks
    if (filter === 'in_progress') return tasks.filter(t => t.status === 'in_progress')
    return tasks.filter(t => t.urgencyStatus === filter)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'destructive'
      case 'due_today': return 'warning' 
      case 'due_soon': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle class="w-4 h-4 text-green-600" />
      case 'in_progress': return <Play class="w-4 h-4 text-blue-600" />
      case 'blocked': return <AlertTriangle class="w-4 h-4 text-red-600" />
      default: return <Clock class="w-4 h-4 text-gray-400" />
    }
  }

  const canUpdateProgress = () => {
    return ['field_technician', 'design_engineer', 'team_lead', 'project_manager'].includes(props.currentUser.role)
  }

  const handleTaskUpdate = async (taskId: string, newProgress: number) => {
    if (!canUpdateProgress()) return
    
    try {
      await fetch(`/api/tasks/${taskId}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress, userId: props.currentUser.id })
      })
      // Refresh tasks
      // In real app, this would trigger a refetch
    } catch (error) {
      console.error('Failed to update task progress:', error)
    }
  }

  const getTaskCounts = () => {
    const tasks = myTasks() || []
    return {
      total: tasks.length,
      overdue: tasks.filter(t => t.urgencyStatus === 'overdue').length,
      dueToday: tasks.filter(t => t.urgencyStatus === 'due_today').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length
    }
  }

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p class="text-gray-600">
            Tasks assigned to you across all projects
          </p>
        </div>
        
        <Show when={props.currentUser.role !== 'client'}>
          <div class="flex items-center gap-2">
            <Badge variant="outline">
              {props.currentUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </Show>
      </div>

      {/* Task Summary Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Tasks</p>
              <p class="text-2xl font-bold">{getTaskCounts().total}</p>
            </div>
            <CheckCircle class="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-2xl font-bold">{getTaskCounts().inProgress}</p>
            </div>
            <Play class="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Due Today</p>
              <p class="text-2xl font-bold">{getTaskCounts().dueToday}</p>
            </div>
            <Calendar class="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Overdue</p>
              <p class="text-2xl font-bold">{getTaskCounts().overdue}</p>
            </div>
            <AlertTriangle class="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div class="flex gap-2">
        <Button 
          variant={selectedFilter() === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
        >
          All Tasks
        </Button>
        <Button 
          variant={selectedFilter() === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('in_progress')}
        >
          In Progress
        </Button>
        <Button 
          variant={selectedFilter() === 'due_today' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('due_today')}
        >
          Due Today
        </Button>
        <Button 
          variant={selectedFilter() === 'overdue' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('overdue')}
        >
          Overdue
        </Button>
      </div>

      {/* Tasks List */}
      <div class="space-y-4">
        <Show 
          when={!myTasks.loading && filteredTasks().length > 0}
          fallback={
            <Show 
              when={!myTasks.loading}
              fallback={<div class="text-center py-8">Loading tasks...</div>}
            >
              <Card class="p-8 text-center">
                <CheckCircle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p class="text-gray-600">
                  {selectedFilter() === 'all' 
                    ? "You don't have any tasks assigned yet."
                    : `No tasks match the "${selectedFilter()}" filter.`
                  }
                </p>
              </Card>
            </Show>
          }
        >
          <For each={filteredTasks()}>
            {(task) => (
              <Card class="p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 class="text-lg font-semibold text-gray-900">
                        {task.taskName}
                      </h3>
                      <Badge variant={getUrgencyColor(task.urgencyStatus)}>
                        {task.urgencyStatus.replace('_', ' ')}
                      </Badge>
                      <Show when={task.isMilestone}>
                        <Badge variant="secondary">Milestone</Badge>
                      </Show>
                    </div>
                    
                    <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{task.projectName}</span>
                      <span>•</span>
                      <span class="capitalize">{task.phaseName} Phase</span>
                      <Show when={task.dueDate}>
                        <span>•</span>
                        <span class="flex items-center gap-1">
                          <Calendar class="w-4 h-4" />
                          Due {new Date(task.dueDate!).toLocaleDateString()}
                        </span>
                      </Show>
                    </div>

                    <Show when={task.description}>
                      <p class="text-gray-700 mb-4">{task.description}</p>
                    </Show>

                    {/* Progress Bar */}
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">Progress</span>
                        <span class="font-medium">{task.completionPercentage}%</span>
                      </div>
                      <Progress value={task.completionPercentage} max={100} class="h-2" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <Show when={canUpdateProgress() && task.status !== 'completed'}>
                  <div class="flex items-center justify-end gap-2 pt-4 border-t">
                    <Show when={task.status === 'not_started'}>
                      <Button 
                        size="sm" 
                        onClick={() => handleTaskUpdate(task.id, 1)}
                      >
                        Start Task
                      </Button>
                    </Show>
                    <Show when={task.status === 'in_progress'}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTaskUpdate(task.id, 100)}
                      >
                        Mark Complete
                      </Button>
                    </Show>
                  </div>
                </Show>
              </Card>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}