import { Component, For, Show } from "solid-js"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  ArrowRight,
  Calendar,
  AlertTriangle,
  Play
} from "lucide-solid"
import type { PhaseProgress, ProjectPhase } from "../../lib/types"

interface PhaseTimelineProps {
  phases: PhaseProgress[]
  currentPhase: ProjectPhase
  showDetails?: boolean
  interactive?: boolean
  onPhaseClick?: (phaseId: string) => void
}

export const PhaseTimeline: Component<PhaseTimelineProps> = (props) => {
  const getPhaseDisplayName = (phase: ProjectPhase) => {
    const names = {
      planning: 'Planning & Permits',
      design: 'Network Design',
      implementation: 'Installation', 
      testing: 'Testing & Activation',
      deployment: 'Go-Live & Handover'
    }
    return names[phase] || phase
  }

  const getPhaseIcon = (phase: PhaseProgress, index: number) => {
    if (phase.status === 'completed') {
      return <CheckCircle class="w-8 h-8 text-green-600" />
    }
    if (phase.status === 'active') {
      return <Play class="w-8 h-8 text-blue-600" />
    }
    return <Circle class="w-8 h-8 text-gray-300" />
  }

  const getPhaseStatusColor = (status: string, progress: number) => {
    switch (status) {
      case 'completed': 
        return 'border-green-500 bg-green-50'
      case 'active': 
        return progress > 0 ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-25'
      case 'locked':
        return 'border-gray-300 bg-gray-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getConnectorColor = (prevPhase: PhaseProgress, currentPhase: PhaseProgress) => {
    if (prevPhase.status === 'completed' && currentPhase.status !== 'locked') {
      return 'bg-green-500'
    }
    if (prevPhase.status === 'completed' || prevPhase.status === 'active') {
      return 'bg-blue-500'
    }
    return 'bg-gray-300'
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div class="space-y-6">
      {/* Timeline Header */}
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Project Timeline</h3>
        <p class="text-gray-600">Track progress through each phase of your project</p>
      </div>

      {/* Timeline Visualization */}
      <div class="relative">
        {/* Mobile Timeline (Vertical) */}
        <div class="block md:hidden space-y-4">
          <For each={props.phases}>
            {(phase, index) => (
              <div class="relative">
                {/* Connector Line */}
                <Show when={index() > 0}>
                  <div class="absolute left-4 -top-4 w-0.5 h-4 bg-gray-300" />
                </Show>

                <Card 
                  class={`p-4 cursor-pointer transition-all ${
                    getPhaseStatusColor(phase.status, phase.progress)
                  } ${props.interactive ? 'hover:shadow-md' : ''}`}
                  onClick={() => props.onPhaseClick?.(phase.phase.id)}
                >
                  <div class="flex items-start gap-4">
                    {getPhaseIcon(phase, index())}
                    
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-gray-900">
                          {getPhaseDisplayName(phase.phase.phaseName)}
                        </h4>
                        <Badge 
                          variant="outline"
                          class={
                            phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                            phase.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-600'
                          }
                        >
                          {phase.status === 'active' ? `${phase.progress}%` : phase.status}
                        </Badge>
                      </div>

                      <Show when={phase.status === 'active' || phase.status === 'completed'}>
                        <div class="space-y-2 mb-3">
                          <Progress value={phase.progress} max={100} class="h-2" />
                        </div>
                      </Show>

                      <Show when={props.showDetails}>
                        <div class="text-sm text-gray-600 space-y-1">
                          <div class="flex items-center justify-between">
                            <span>Tasks</span>
                            <span>{phase.tasksCompleted}/{phase.tasksTotal}</span>
                          </div>
                          
                          <Show when={phase.phase.startDate}>
                            <div class="flex items-center gap-2">
                              <Calendar class="w-4 h-4" />
                              <span>Started {formatDate(phase.phase.startDate)}</span>
                            </div>
                          </Show>
                          
                          <Show when={phase.phase.targetEndDate}>
                            <div class="flex items-center gap-2">
                              <Clock class="w-4 h-4" />
                              <span>Due {formatDate(phase.phase.targetEndDate)}</span>
                            </div>
                          </Show>
                        </div>
                      </Show>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </For>
        </div>

        {/* Desktop Timeline (Horizontal) */}
        <div class="hidden md:block">
          <div class="flex items-center justify-between relative">
            {/* Background connector line */}
            <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            
            <For each={props.phases}>
              {(phase, index) => (
                <div class="relative flex-1 flex flex-col items-center">
                  {/* Phase Node */}
                  <div 
                    class={`relative z-10 p-6 rounded-lg border-2 transition-all cursor-pointer ${
                      getPhaseStatusColor(phase.status, phase.progress)
                    } ${props.interactive ? 'hover:shadow-lg' : ''}`}
                    onClick={() => props.onPhaseClick?.(phase.phase.id)}
                  >
                    <div class="text-center space-y-3">
                      {/* Phase Icon */}
                      <div class="flex justify-center">
                        {getPhaseIcon(phase, index())}
                      </div>
                      
                      {/* Phase Name */}
                      <h4 class="font-semibold text-gray-900 text-sm">
                        {getPhaseDisplayName(phase.phase.phaseName)}
                      </h4>
                      
                      {/* Status Badge */}
                      <Badge 
                        variant="outline"
                        class={
                          phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          phase.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }
                      >
                        {phase.status === 'active' ? `${phase.progress}%` : phase.status}
                      </Badge>
                      
                      {/* Progress Bar for Active Phases */}
                      <Show when={phase.status === 'active' && phase.progress > 0}>
                        <div class="w-full">
                          <Progress value={phase.progress} max={100} class="h-2" />
                        </div>
                      </Show>
                      
                      {/* Additional Details */}
                      <Show when={props.showDetails}>
                        <div class="text-xs text-gray-600 space-y-1">
                          <div>{phase.tasksCompleted}/{phase.tasksTotal} tasks</div>
                          <Show when={phase.phase.targetEndDate}>
                            <div>Due {formatDate(phase.phase.targetEndDate)}</div>
                          </Show>
                        </div>
                      </Show>
                    </div>
                  </div>
                  
                  {/* Progress Connector to Next Phase */}
                  <Show when={index() < props.phases.length - 1}>
                    <div class="absolute top-1/2 left-full w-full h-1 -translate-y-1/2">
                      <div 
                        class={`h-full transition-all ${
                          getConnectorColor(phase, props.phases[index() + 1])
                        }`}
                        style={{
                          width: phase.status === 'completed' ? '100%' : 
                                 phase.status === 'active' ? `${phase.progress}%` : '0%'
                        }}
                      />
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Timeline Legend */}
      <div class="flex justify-center">
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-600" />
            <span class="text-gray-600">Completed</span>
          </div>
          <div class="flex items-center gap-2">
            <Play class="w-4 h-4 text-blue-600" />
            <span class="text-gray-600">In Progress</span>
          </div>
          <div class="flex items-center gap-2">
            <Circle class="w-4 h-4 text-gray-300" />
            <span class="text-gray-600">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Current Phase Highlight */}
      <Show when={props.phases.find(p => p.status === 'active')}>
        {(activePhase) => (
          <Card class="p-4 bg-blue-50 border-blue-200">
            <div class="flex items-center gap-3">
              <Play class="w-5 h-5 text-blue-600" />
              <div>
                <h4 class="font-semibold text-blue-900">
                  Currently Working On: {getPhaseDisplayName(activePhase().phase.phaseName)}
                </h4>
                <p class="text-blue-800 text-sm">
                  {activePhase().progress}% complete • {activePhase().tasksCompleted} of {activePhase().tasksTotal} tasks finished
                </p>
              </div>
            </div>
          </Card>
        )}
      </Show>

      {/* Next Phase Preview */}
      <Show when={props.phases.find(p => p.status === 'locked')}>
        {(nextPhase) => (
          <Card class="p-4 bg-gray-50 border-gray-200">
            <div class="flex items-center gap-3">
              <Clock class="w-5 h-5 text-gray-600" />
              <div>
                <h4 class="font-semibold text-gray-900">
                  Up Next: {getPhaseDisplayName(nextPhase().phase.phaseName)}
                </h4>
                <p class="text-gray-600 text-sm">
                  Will begin when current phase requirements are met
                </p>
              </div>
            </div>
          </Card>
        )}
      </Show>
    </div>
  )
}