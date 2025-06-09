import { Component, createResource, For, Show, Match, Switch } from "solid-js"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Eye,
  Edit
} from "lucide-solid"
import type { Project, User as UserType, UserRole, TaskWithProject } from "../../lib/types"

interface ProjectOverviewProps {
  projectId: string
  currentUser: UserType
}

export const ProjectOverview: Component<ProjectOverviewProps> = (props) => {
  // Fetch project data based on user role
  const [projectData] = createResource(
    () => ({ projectId: props.projectId, userId: props.currentUser.id, role: props.currentUser.role }),
    async ({ projectId, userId, role }) => {
      const response = await fetch(`/api/projects/${projectId}/overview?userId=${userId}&role=${role}`)
      const data = await response.json()
      return data.data as {
        project: Project
        progress: ProjectProgress
        myTasks?: TaskWithProject[]
        teamTasks?: TaskWithProject[]
        allTasks?: TaskWithProject[]
        teamMembers?: UserType[]
        recentActivity?: any[]
      }
    }
  )

  const canViewAllTasks = () => {
    const permissions = ROLE_PERMISSIONS[props.currentUser.role]
    return ['all', 'project_tasks'].includes(permissions.viewTasks)
  }

  const canManageWorkflow = () => {
    return ROLE_PERMISSIONS[props.currentUser.role].modifyWorkflow
  }

  const canViewTeamData = () => {
    const permissions = ROLE_PERMISSIONS[props.currentUser.role]
    return ['all', 'project_tasks', 'team_and_assigned'].includes(permissions.viewTasks)
  }

  const getTasksToShow = () => {
    const data = projectData()
    if (!data) return []
    
    const permissions = ROLE_PERMISSIONS[props.currentUser.role]
    
    switch (permissions.viewTasks) {
      case 'all':
      case 'project_tasks':
        return data.allTasks || []
      case 'team_and_assigned':
        return data.teamTasks || []
      case 'assigned_only':
        return data.myTasks || []
      default:
        return []
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPhaseDisplayName = (phase: string) => {
    const names = {
      planning: 'Planning & Permits',
      design: 'Network Design', 
      implementation: 'Installation',
      testing: 'Testing & Activation',
      deployment: 'Go-Live & Handover'
    }
    return names[phase as keyof typeof names] || phase
  }

  return (
    <div class="space-y-6">
      <Show 
        when={!projectData.loading && projectData()}
        fallback={<div class="text-center py-8">Loading project overview...</div>}
      >
        {(data) => (
          <>
            {/* Project Header - Adapted by Role */}
            <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h1 class="text-3xl font-bold mb-2">{data().project.name}</h1>
                  
                  <div class="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" class="bg-white/20 text-white">
                      {getPhaseDisplayName(data().project.currentPhase)}
                    </Badge>
                    <span class="text-gray-300">
                      {data().progress.overallProgress}% Complete
                    </span>
                  </div>

                  <Show when={data().project.description}>
                    <p class="text-gray-300 mb-4">{data().project.description}</p>
                  </Show>

                  {/* Role-specific information */}
                  <Switch>
                    <Match when={props.currentUser.role === 'client'}>
                      <div class="flex items-center gap-4 text-sm">
                        <span class="flex items-center gap-2">
                          <User class="w-4 h-4" />
                          Project Manager: John Doe
                        </span>
                      </div>
                    </Match>
                    
                    <Match when={canViewTeamData()}>
                      <div class="flex items-center gap-6 text-sm">
                        <Show when={data().teamMembers}>
                          <span class="flex items-center gap-2">
                            <Users class="w-4 h-4" />
                            {data().teamMembers!.length} Team Members
                          </span>
                        </Show>
                        <Show when={data().project.startDate}>
                          <span class="flex items-center gap-2">
                            <Calendar class="w-4 h-4" />
                            Started {formatDate(data().project.startDate)}
                          </span>
                        </Show>
                        <Show when={data().project.targetCompletionDate}>
                          <span class="flex items-center gap-2">
                            <Clock class="w-4 h-4" />
                            Due {formatDate(data().project.targetCompletionDate)}
                          </span>
                        </Show>
                      </div>
                    </Match>
                  </Switch>
                </div>

                {/* Action Buttons - Role-based */}
                <div class="flex items-center gap-2">
                  <Switch>
                    <Match when={canManageWorkflow()}>
                      <Button variant="secondary">
                        <Settings class="w-4 h-4 mr-2" />
                        Manage Workflow
                      </Button>
                      <Button variant="secondary">
                        <Edit class="w-4 h-4 mr-2" />
                        Edit Project
                      </Button>
                    </Match>
                    
                    <Match when={props.currentUser.role === 'client'}>
                      <Button variant="secondary">
                        <Eye class="w-4 h-4 mr-2" />
                        View Progress
                      </Button>
                    </Match>
                    
                    <Match when={true}>
                      <Button variant="secondary">
                        <BarChart3 class="w-4 h-4 mr-2" />
                        View Reports
                      </Button>
                    </Match>
                  </Switch>
                </div>
              </div>

              {/* Overall Progress */}
              <div class="mt-6 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Overall Progress</span>
                  <span class="font-bold text-xl">{data().progress.overallProgress}%</span>
                </div>
                <Progress 
                  value={data().progress.overallProgress} 
                  max={100} 
                  class="h-3 bg-gray-600" 
                />
              </div>
            </div>

            {/* Phase Progress - Shown to all roles */}
            <Card class="p-6">
              <h2 class="text-xl font-semibold mb-6">Phase Progress</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <For each={data().progress.phases}>
                  {(phase) => (
                    <div class="text-center p-4 rounded-lg border">
                      <h3 class="font-medium text-gray-900 mb-2">
                        {getPhaseDisplayName(phase.phase.phaseName)}
                      </h3>
                      
                      <div class="space-y-3">
                        <Badge 
                          variant="outline"
                          class={
                            phase.status === 'completed' ? 'bg-green-50 text-green-700' :
                            phase.status === 'active' ? 'bg-blue-50 text-blue-700' :
                            'bg-gray-50 text-gray-500'
                          }
                        >
                          {phase.status}
                        </Badge>
                        
                        <div class="space-y-1">
                          <div class="text-sm text-gray-600">{phase.progress}%</div>
                          <Progress value={phase.progress} max={100} class="h-2" />
                        </div>
                        
                        <Show when={canViewAllTasks()}>
                          <div class="text-xs text-gray-500">
                            {phase.tasksCompleted}/{phase.tasksTotal} tasks
                          </div>
                        </Show>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Card>

            {/* Task Summary - Role-specific */}
            <Show when={getTasksToShow().length > 0}>
              <Card class="p-6">
                <h2 class="text-xl font-semibold mb-6">
                  <Switch>
                    <Match when={props.currentUser.role === 'field_technician'}>
                      My Assigned Tasks
                    </Match>
                    <Match when={canViewAllTasks()}>
                      All Project Tasks
                    </Match>
                    <Match when={canViewTeamData()}>
                      Team Tasks
                    </Match>
                  </Switch>
                </h2>

                <div class="space-y-3">
                  <For each={getTasksToShow().slice(0, 5)}>
                    {(task) => (
                      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <Switch>
                            <Match when={task.status === 'completed'}>
                              <CheckCircle class="w-5 h-5 text-green-600" />
                            </Match>
                            <Match when={task.urgencyStatus === 'overdue'}>
                              <AlertTriangle class="w-5 h-5 text-red-600" />
                            </Match>
                            <Match when={true}>
                              <Clock class="w-5 h-5 text-gray-400" />
                            </Match>
                          </Switch>
                          
                          <div>
                            <h4 class="font-medium text-gray-900">{task.taskName}</h4>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                              <span class="capitalize">{task.phaseName}</span>
                              <Show when={canViewTeamData() && task.assigneeId}>
                                <span>• Assigned to User {task.assigneeId}</span>
                              </Show>
                              <Show when={task.dueDate}>
                                <span>• Due {formatDate(task.dueDate)}</span>
                              </Show>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-3">
                          <Badge 
                            variant="outline"
                            class={
                              task.urgencyStatus === 'overdue' ? 'text-red-600 border-red-200' :
                              task.urgencyStatus === 'due_today' ? 'text-yellow-600 border-yellow-200' :
                              'text-gray-600'
                            }
                          >
                            {task.urgencyStatus.replace('_', ' ')}
                          </Badge>
                          
                          <div class="text-right">
                            <div class="text-sm font-medium">{task.completionPercentage}%</div>
                            <Progress value={task.completionPercentage} max={100} class="h-1 w-16" />
                          </div>
                        </div>
                      </div>
                    )}
                  </For>

                  <Show when={getTasksToShow().length > 5}>
                    <div class="text-center pt-4">
                      <Button variant="outline">
                        View All {getTasksToShow().length} Tasks
                      </Button>
                    </div>
                  </Show>
                </div>
              </Card>
            </Show>

            {/* Team Members - Project Manager and Admin only */}
            <Show when={canManageWorkflow() && data().teamMembers}>
              <Card class="p-6">
                <h2 class="text-xl font-semibold mb-6">Team Members</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={data().teamMembers}>
                    {(member) => (
                      <div class="flex items-center gap-3 p-4 border rounded-lg">
                        <User class="w-10 h-10 text-gray-400" />
                        <div>
                          <h4 class="font-medium text-gray-900">{member.name}</h4>
                          <p class="text-sm text-gray-600 capitalize">
                            {member.role.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Card>
            </Show>

            {/* Recent Activity - Admins and Project Managers */}
            <Show when={canManageWorkflow() && data().recentActivity}>
              <Card class="p-6">
                <h2 class="text-xl font-semibold mb-6">Recent Activity</h2>
                
                <div class="space-y-4">
                  <For each={data().recentActivity?.slice(0, 5)}>
                    {(activity) => (
                      <div class="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                        <Clock class="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p class="text-gray-900">{activity.description}</p>
                          <p class="text-sm text-gray-600">
                            {activity.user} • {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Card>
            </Show>

            {/* Next Steps - Client-friendly summary */}
            <Show when={props.currentUser.role === 'client'}>
              <Card class="p-6 bg-blue-50 border-blue-200">
                <h2 class="text-xl font-semibold text-blue-900 mb-4">What's Happening Next</h2>
                
                <div class="space-y-3">
                  <Show when={data().progress.nextMilestone}>
                    <div class="flex items-start gap-3">
                      <Calendar class="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 class="font-medium text-blue-900">
                          {data().progress.nextMilestone!.name}
                        </h4>
                        <p class="text-blue-800">{data().progress.nextMilestone!.description}</p>
                        <p class="text-sm text-blue-600">
                          Expected: {formatDate(data().progress.nextMilestone!.estimatedDate)}
                        </p>
                      </div>
                    </div>
                  </Show>
                </div>
              </Card>
            </Show>
          </>
        )}
      </Show>
    </div>
  )
}