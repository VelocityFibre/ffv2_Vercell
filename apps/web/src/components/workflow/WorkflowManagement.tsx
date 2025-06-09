import { Component, createSignal, createResource, For, Show } from "solid-js"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Select } from "../ui/select"
import { Dialog } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Progress } from "../ui/progress"
import { 
  Settings, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  UserPlus
} from "lucide-solid"
import type { Project, Task, Phase, User as UserType, TaskStatus, TaskPriority } from "../../../packages/shared/types"

interface WorkflowManagementProps {
  projectId: string
  currentUser: UserType
}

export const WorkflowManagement: Component<WorkflowManagementProps> = (props) => {
  const [selectedPhase, setSelectedPhase] = createSignal<string>('')
  const [showTaskDialog, setShowTaskDialog] = createSignal(false)
  const [showAssignDialog, setShowAssignDialog] = createSignal(false)
  const [selectedTask, setSelectedTask] = createSignal<Task | null>(null)

  // Fetch project workflow data
  const [projectData] = createResource(
    () => props.projectId,
    async (projectId) => {
      const response = await fetch(`/api/projects/${projectId}/workflow`)
      const data = await response.json()
      return data.data as {
        project: Project
        phases: Phase[]
        tasks: Task[]
        availableUsers: UserType[]
      }
    }
  )

  // Fetch available users for assignment
  const [availableUsers] = createResource(
    () => props.projectId,
    async (projectId) => {
      const response = await fetch(`/api/projects/${projectId}/users`)
      const data = await response.json()
      return data.data as UserType[]
    }
  )

  const getTasksForPhase = (phaseId: string) => {
    const data = projectData()
    if (!data) return []
    return data.tasks.filter(task => task.phaseId === phaseId)
  }

  const getPhaseProgress = (phaseId: string) => {
    const tasks = getTasksForPhase(phaseId)
    if (tasks.length === 0) return 0
    const completed = tasks.filter(task => task.status === 'completed').length
    return Math.round((completed / tasks.length) * 100)
  }

  const canAdvancePhase = (phase: Phase) => {
    const tasks = getTasksForPhase(phase.id)
    const blockingTasks = tasks.filter(task => task.isBlocking && task.status !== 'completed')
    return blockingTasks.length === 0
  }

  const handleAdvancePhase = async (phaseId: string) => {
    try {
      await fetch(`/api/projects/${props.projectId}/phases/${phaseId}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: props.currentUser.id })
      })
      // Refresh data
    } catch (error) {
      console.error('Failed to advance phase:', error)
    }
  }

  const handleTaskAssignment = async (taskId: string, userId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigneeId: userId, assignedBy: props.currentUser.id })
      })
      setShowAssignDialog(false)
      // Refresh data
    } catch (error) {
      console.error('Failed to assign task:', error)
    }
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await fetch(`/api/projects/${props.projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          projectId: props.projectId,
          createdBy: props.currentUser.id
        })
      })
      setShowTaskDialog(false)
      // Refresh data
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'not_started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div class="space-y-6">
      <Show 
        when={!projectData.loading && projectData()}
        fallback={<div class="text-center py-8">Loading workflow data...</div>}
      >
        {(data) => (
          <>
            {/* Project Header */}
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">
                  {data().project.name} - Workflow Management
                </h1>
                <div class="flex items-center gap-4">
                  <Badge variant="outline" class="capitalize">
                    {data().project.currentPhase.replace('_', ' ')} Phase
                  </Badge>
                  <span class="text-gray-600">
                    {data().project.completionPercentage}% Complete
                  </span>
                </div>
              </div>
              
              <div class="flex gap-2">
                <Button onClick={() => setShowTaskDialog(true)}>
                  <Plus class="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline">
                  <Settings class="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Phase Overview */}
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <For each={data().phases}>
                {(phase) => (
                  <Card class={`p-4 cursor-pointer transition-colors ${
                    selectedPhase() === phase.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPhase(phase.id)}
                  >
                    <div class="text-center">
                      <h3 class="font-semibold text-gray-900 mb-2 capitalize">
                        {phase.phaseName.replace('_', ' ')}
                      </h3>
                      
                      <div class="space-y-3">
                        <Badge 
                          variant="outline"
                          class={phase.status === 'active' ? 'bg-blue-50 text-blue-700' : ''}
                        >
                          {phase.status}
                        </Badge>
                        
                        <div class="space-y-1">
                          <div class="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{getPhaseProgress(phase.id)}%</span>
                          </div>
                          <Progress value={getPhaseProgress(phase.id)} max={100} class="h-2" />
                        </div>
                        
                        <div class="text-sm text-gray-600">
                          {getTasksForPhase(phase.id).length} tasks
                        </div>
                        
                        <Show when={phase.status === 'active' && canAdvancePhase(phase)}>
                          <Button 
                            size="sm" 
                            class="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAdvancePhase(phase.id)
                            }}
                          >
                            <ArrowRight class="w-4 h-4 mr-1" />
                            Advance
                          </Button>
                        </Show>
                      </div>
                    </div>
                  </Card>
                )}
              </For>
            </div>

            {/* Task Management */}
            <Show when={selectedPhase()}>
              {(phaseId) => {
                const phase = data().phases.find(p => p.id === phaseId())
                const tasks = getTasksForPhase(phaseId())
                
                return (
                  <Card class="p-6">
                    <div class="flex items-center justify-between mb-6">
                      <h2 class="text-xl font-semibold capitalize">
                        {phase?.phaseName.replace('_', ' ')} Tasks
                      </h2>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(null)
                          setShowTaskDialog(true)
                        }}
                      >
                        <Plus class="w-4 h-4 mr-2" />
                        Add Task to Phase
                      </Button>
                    </div>

                    <div class="space-y-4">
                      <Show 
                        when={tasks.length > 0}
                        fallback={
                          <div class="text-center py-8 text-gray-500">
                            No tasks in this phase yet. Create your first task to get started.
                          </div>
                        }
                      >
                        <For each={tasks}>
                          {(task) => (
                            <Card class="p-4 hover:shadow-md transition-shadow">
                              <div class="flex items-start justify-between">
                                <div class="flex-1">
                                  <div class="flex items-center gap-3 mb-2">
                                    <h3 class="font-semibold text-gray-900">
                                      {task.taskName}
                                    </h3>
                                    <Badge class={getStatusColor(task.status)}>
                                      {task.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge class={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Badge>
                                    <Show when={task.isMilestone}>
                                      <Badge variant="secondary">Milestone</Badge>
                                    </Show>
                                    <Show when={task.isBlocking}>
                                      <Badge variant="destructive">Blocking</Badge>
                                    </Show>
                                  </div>

                                  <Show when={task.description}>
                                    <p class="text-gray-600 mb-3">{task.description}</p>
                                  </Show>

                                  <div class="flex items-center gap-6 text-sm text-gray-500 mb-3">
                                    <Show when={task.assigneeId}>
                                      <span class="flex items-center gap-1">
                                        <User class="w-4 h-4" />
                                        Assigned to User {task.assigneeId}
                                      </span>
                                    </Show>
                                    <Show when={task.dueDate}>
                                      <span class="flex items-center gap-1">
                                        <Calendar class="w-4 h-4" />
                                        Due {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    </Show>
                                    <Show when={task.estimatedHours}>
                                      <span class="flex items-center gap-1">
                                        <Clock class="w-4 h-4" />
                                        {task.estimatedHours}h estimated
                                      </span>
                                    </Show>
                                  </div>

                                  <div class="flex items-center justify-between">
                                    <div class="flex-1 mr-4">
                                      <div class="flex justify-between text-sm mb-1">
                                        <span>Progress</span>
                                        <span>{task.completionPercentage}%</span>
                                      </div>
                                      <Progress value={task.completionPercentage} max={100} class="h-2" />
                                    </div>
                                  </div>
                                </div>

                                <div class="flex items-center gap-2 ml-4">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedTask(task)
                                      setShowAssignDialog(true)
                                    }}
                                  >
                                    <UserPlus class="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedTask(task)
                                      setShowTaskDialog(true)
                                    }}
                                  >
                                    <Edit class="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          )}
                        </For>
                      </Show>
                    </div>
                  </Card>
                )
              }}
            </Show>

            {/* Task Assignment Dialog */}
            <Dialog open={showAssignDialog()} onOpenChange={setShowAssignDialog}>
              <Dialog.Content class="max-w-md">
                <Dialog.Header>
                  <Dialog.Title>Assign Task</Dialog.Title>
                  <Dialog.Description>
                    Assign "{selectedTask()?.taskName}" to a team member
                  </Dialog.Description>
                </Dialog.Header>
                
                <div class="space-y-4">
                  <Show when={availableUsers()}>
                    <Select placeholder="Select team member">
                      <For each={availableUsers()}>
                        {(user) => (
                          <Select.Item value={user.id}>
                            <div class="flex items-center gap-2">
                              <User class="w-4 h-4" />
                              <span>{user.name}</span>
                              <Badge variant="outline" class="ml-auto">
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </div>
                          </Select.Item>
                        )}
                      </For>
                    </Select>
                  </Show>
                </div>

                <Dialog.Footer>
                  <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Handle assignment logic here
                    setShowAssignDialog(false)
                  }}>
                    Assign Task
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>

            {/* Task Creation/Edit Dialog */}
            <Dialog open={showTaskDialog()} onOpenChange={setShowTaskDialog}>
              <Dialog.Content class="max-w-2xl">
                <Dialog.Header>
                  <Dialog.Title>
                    {selectedTask() ? 'Edit Task' : 'Create New Task'}
                  </Dialog.Title>
                </Dialog.Header>
                
                <div class="space-y-4">
                  <Input 
                    placeholder="Task name"
                    value={selectedTask()?.taskName || ''}
                  />
                  <Textarea 
                    placeholder="Task description"
                    value={selectedTask()?.description || ''}
                  />
                  
                  <div class="grid grid-cols-2 gap-4">
                    <Select placeholder="Priority">
                      <Select.Item value="low">Low</Select.Item>
                      <Select.Item value="medium">Medium</Select.Item>
                      <Select.Item value="high">High</Select.Item>
                      <Select.Item value="critical">Critical</Select.Item>
                    </Select>
                    
                    <Input 
                      type="date"
                      placeholder="Due date"
                    />
                  </div>
                  
                  <Input 
                    type="number"
                    placeholder="Estimated hours"
                    value={selectedTask()?.estimatedHours || ''}
                  />
                </div>

                <Dialog.Footer>
                  <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Handle task creation/edit logic here
                    setShowTaskDialog(false)
                  }}>
                    {selectedTask() ? 'Update Task' : 'Create Task'}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </>
        )}
      </Show>
    </div>
  )
}