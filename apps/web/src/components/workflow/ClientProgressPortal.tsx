import { Component, createResource, For, Show } from "solid-js"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Mail,
  AlertCircle
} from "lucide-solid"
import type { ClientProjectView, ProjectPhase } from "../../lib/types"

interface ClientProgressPortalProps {
  projectId: string
  clientId: string
}

export const ClientProgressPortal: Component<ClientProgressPortalProps> = (props) => {
  // Fetch client-specific project view
  const [projectData] = createResource(
    () => ({ projectId: props.projectId, clientId: props.clientId }),
    async ({ projectId, clientId }) => {
      const response = await fetch(`/api/projects/${projectId}/client-view?clientId=${clientId}`)
      const data = await response.json()
      return data.data as ClientProjectView
    }
  )

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'active': return 'text-blue-600 bg-blue-50'
      case 'locked': return 'text-gray-400 bg-gray-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getPhaseIcon = (phase: ProjectPhase, status: string) => {
    if (status === 'completed') {
      return <CheckCircle class="w-6 h-6 text-green-600" />
    }
    if (status === 'active') {
      return <Clock class="w-6 h-6 text-blue-600" />
    }
    return <div class="w-6 h-6 rounded-full border-2 border-gray-300" />
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  const phaseDisplayNames = {
    planning: 'Planning & Permits',
    design: 'Network Design',
    implementation: 'Installation',
    testing: 'Testing & Activation',
    deployment: 'Go-Live & Handover'
  }

  return (
    <div class="space-y-8">
      <Show 
        when={!projectData.loading && projectData()}
        fallback={<div class="text-center py-8">Loading project details...</div>}
      >
        {(project) => (
          <>
            {/* Project Header */}
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">{project().projectName}</h1>
                  <div class="flex items-center gap-4 text-blue-100">
                    <span class="capitalize text-lg">
                      {project().currentPhase.replace('_', ' ')} Phase
                    </span>
                    <Badge variant="secondary" class="bg-white/20 text-white">
                      {project().overallProgress}% Complete
                    </Badge>
                  </div>
                </div>
                
                <div class="text-right">
                  <p class="text-blue-100 mb-1">Project Manager</p>
                  <div class="flex items-center gap-2">
                    <User class="w-4 h-4" />
                    <span class="font-medium">{project().projectManager.name}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <Phone class="w-4 h-4" />
                    <span class="text-sm">{project().projectManager.contact}</span>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-blue-100">Overall Progress</span>
                  <span class="font-bold text-xl">{project().overallProgress}%</span>
                </div>
                <Progress 
                  value={project().overallProgress} 
                  max={100} 
                  class="h-3 bg-blue-500/30" 
                />
              </div>

              <Show when={project().estimatedCompletion}>
                <div class="mt-4 flex items-center gap-2 text-blue-100">
                  <Calendar class="w-4 h-4" />
                  <span>Estimated Completion: {formatDate(project().estimatedCompletion!)}</span>
                </div>
              </Show>
            </div>

            {/* Phase Timeline */}
            <Card class="p-6">
              <h2 class="text-xl font-semibold mb-6">Project Timeline</h2>
              
              <div class="space-y-6">
                <For each={Object.entries(project().phaseProgress) as [ProjectPhase, any][]}>
                  {([phaseName, phaseData]) => (
                    <div class="flex items-start gap-4">
                      {/* Phase Icon */}
                      <div class="flex-shrink-0 mt-1">
                        {getPhaseIcon(phaseName, phaseData.status)}
                      </div>
                      
                      {/* Phase Content */}
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <h3 class="text-lg font-medium text-gray-900">
                            {phaseDisplayNames[phaseName]}
                          </h3>
                          <Badge 
                            variant="outline"
                            class={getPhaseStatusColor(phaseData.status)}
                          >
                            {phaseData.status === 'active' ? `${phaseData.progress}%` : phaseData.status}
                          </Badge>
                        </div>
                        
                        <Show when={phaseData.publicSummary}>
                          <p class="text-gray-600 mb-3">{phaseData.publicSummary}</p>
                        </Show>
                        
                        <Show when={phaseData.status === 'active' && phaseData.progress > 0}>
                          <div class="space-y-1 mb-3">
                            <Progress value={phaseData.progress} max={100} class="h-2" />
                          </div>
                        </Show>
                        
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                          <Show when={phaseData.completedDate}>
                            <span class="flex items-center gap-1">
                              <CheckCircle class="w-4 h-4 text-green-600" />
                              Completed {formatDate(phaseData.completedDate)}
                            </span>
                          </Show>
                          <Show when={phaseData.estimatedStart && phaseData.status === 'locked'}>
                            <span class="flex items-center gap-1">
                              <Clock class="w-4 h-4" />
                              Estimated start: {formatDate(phaseData.estimatedStart)}
                            </span>
                          </Show>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Card>

            {/* Next Milestone */}
            <Show when={project().milestones.find(m => m.status === 'pending')}>
              {(nextMilestone) => (
                <Card class="p-6 border-blue-200 bg-blue-50">
                  <div class="flex items-start gap-4">
                    <AlertCircle class="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 class="text-lg font-semibold text-blue-900 mb-2">
                        Next Milestone: {nextMilestone().name}
                      </h3>
                      <p class="text-blue-800 mb-2">{nextMilestone().description}</p>
                      <div class="flex items-center gap-2 text-blue-700">
                        <Calendar class="w-4 h-4" />
                        <span>Expected: {formatDate(nextMilestone().date)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Show>

            {/* Recent Updates */}
            <Show when={project().publicUpdates.length > 0}>
              <Card class="p-6">
                <h2 class="text-xl font-semibold mb-6">Recent Updates</h2>
                
                <div class="space-y-4">
                  <For each={project().publicUpdates.slice(0, 5)}>
                    {(update) => (
                      <div class="border-l-4 border-blue-500 pl-4 py-2">
                        <div class="flex items-center justify-between mb-2">
                          <h4 class="font-medium text-gray-900">{update.title}</h4>
                          <span class="text-sm text-gray-500">
                            {formatDate(update.date)}
                          </span>
                        </div>
                        <p class="text-gray-700 mb-1">{update.message}</p>
                        <p class="text-sm text-gray-500">— {update.author}</p>
                      </div>
                    )}
                  </For>
                </div>
              </Card>
            </Show>

            {/* Completed Milestones */}
            <Show when={project().milestones.filter(m => m.status === 'completed').length > 0}>
              <Card class="p-6">
                <h2 class="text-xl font-semibold mb-6">Completed Milestones</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <For each={project().milestones.filter(m => m.status === 'completed')}>
                    {(milestone) => (
                      <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle class="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 class="font-medium text-green-900">{milestone.name}</h4>
                          <p class="text-sm text-green-700 mb-1">{milestone.description}</p>
                          <span class="text-xs text-green-600">
                            {formatDate(milestone.date)}
                          </span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Card>
            </Show>

            {/* Contact Information */}
            <Card class="p-6 bg-gray-50">
              <h2 class="text-lg font-semibold mb-4">Questions or Concerns?</h2>
              <p class="text-gray-700 mb-4">
                Your project manager is available to discuss any questions about your fiber installation project.
              </p>
              
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <User class="w-5 h-5 text-gray-600" />
                  <span class="font-medium">{project().projectManager.name}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Phone class="w-5 h-5 text-gray-600" />
                  <span>{project().projectManager.contact}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </Show>
    </div>
  )
}