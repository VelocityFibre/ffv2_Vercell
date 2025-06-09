// Shared types for FibreFlow V2

export type UserRole = 'admin' | 'project_manager' | 'field_technician' | 'client'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  password?: string
}

export type ProjectPhase = 'planning' | 'design' | 'implementation' | 'testing' | 'deployment'

export interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  clientId: string
  managerId: string
  currentPhase: ProjectPhase
}

export interface Task {
  id: string
  name: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  progress: number
  assigneeId: string
  projectId: string
  phaseId: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
}

export interface TaskWithProject extends Task {
  taskName: string
  projectName: string
  phaseName: string
  urgencyStatus: 'overdue' | 'due_today' | 'due_soon' | 'normal'
  completionPercentage: number
  isMilestone: boolean
}

export interface PhaseProgress {
  phase: {
    id: string
    phaseName: ProjectPhase
    startDate?: string
    targetEndDate?: string
  }
  status: 'locked' | 'active' | 'completed'
  progress: number
  tasksCompleted: number
  tasksTotal: number
}

export interface ClientProjectView {
  projectName: string
  currentPhase: ProjectPhase
  overallProgress: number
  estimatedCompletion?: string
  projectManager: {
    name: string
    contact: string
  }
  phaseProgress: Record<ProjectPhase, {
    status: string
    progress: number
    publicSummary?: string
    completedDate?: string
    estimatedStart?: string
  }>
  milestones: Array<{
    name: string
    description: string
    date: string
    status: 'pending' | 'completed'
  }>
  publicUpdates: Array<{
    title: string
    message: string
    date: string
    author: string
  }>
}