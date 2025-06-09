import { Component, createSignal, createEffect, For, Show } from "solid-js"
import { A } from "@solidjs/router"
import { Card, Button, Badge, Input } from "../../../components/ui"
import { Plus, Edit, Trash2, Eye, Calendar, FolderOpen } from "lucide-solid"
import { mockAPI } from "../../../lib/mockData"
import type { Project } from "../../../types"

const AdminProjects: Component = () => {
  const allProjects = mockAPI.getAllProjects()
  console.log('mockAPI.getAllProjects():', allProjects)
  console.log('projects length:', allProjects?.length)
  console.log('First project:', allProjects?.[0])
  
  const [projects, setProjects] = createSignal<Project[]>(allProjects || [])
  const [showCreateForm, setShowCreateForm] = createSignal(false)
  const [newProject, setNewProject] = createSignal<Partial<Project>>({
    name: '',
    description: '',
    currentPhase: 'planning',
    completionPercentage: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: ''
  })

  const handleCreateProject = () => {
    const project = newProject()
    if (!project.name) return

    const newProj: Project = {
      id: `project-${Date.now()}`,
      name: project.name,
      description: project.description || '',
      currentPhase: project.currentPhase || 'planning',
      completionPercentage: 0,
      startDate: project.startDate || new Date().toISOString(),
      targetCompletionDate: project.targetCompletionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientId: 'user-3', // Default client
      status: 'active'
    }

    setProjects([...projects(), newProj])
    setNewProject({
      name: '',
      description: '',
      currentPhase: 'planning',
      completionPercentage: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: ''
    })
    setShowCreateForm(false)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects().filter(p => p.id !== projectId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'planning': return 'bg-purple-100 text-purple-800'
      case 'design': return 'bg-blue-100 text-blue-800'
      case 'implementation': return 'bg-orange-100 text-orange-800'
      case 'testing': return 'bg-yellow-100 text-yellow-800'
      case 'deployment': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Project Management</h1>
            <p class="ff-page-subtitle">
              Create and manage all projects in the system
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            class="bg-primary text-primary-foreground"
          >
            <Plus class="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Create Project Form */}
      <Show when={showCreateForm()}>
        <section class="ff-section">
          <Card class="p-6 ff-card">
            <h2 class="ff-section-title mb-6">Create New Project</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="ff-label mb-2 block">Project Name *</label>
                <Input
                  placeholder="Enter project name"
                  value={newProject().name || ''}
                  onInput={(e) => setNewProject({...newProject(), name: e.target.value})}
                />
              </div>

              <div>
                <label class="ff-label mb-2 block">Target Completion Date</label>
                <Input
                  type="date"
                  value={newProject().targetCompletionDate || ''}
                  onInput={(e) => setNewProject({...newProject(), targetCompletionDate: e.target.value})}
                />
              </div>

              <div class="md:col-span-2">
                <label class="ff-label mb-2 block">Description</label>
                <Input
                  placeholder="Enter project description"
                  value={newProject().description || ''}
                  onInput={(e) => setNewProject({...newProject(), description: e.target.value})}
                />
              </div>
            </div>

            <div class="flex gap-4 mt-6">
              <Button 
                onClick={handleCreateProject}
                class="bg-primary text-primary-foreground"
              >
                Create Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </section>
      </Show>

      {/* Projects List */}
      <section class="ff-section">
        <h2 class="ff-section-title">All Projects ({projects().length})</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <For each={projects()}>
            {(project) => (
              <Card class="p-6 ff-card">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="ff-card-title">{project.name}</h3>
                    <Show when={project.description}>
                      <p class="text-muted-foreground mb-3">{project.description}</p>
                    </Show>
                  </div>
                </div>

                <div class="space-y-3 mb-4">
                  <div class="flex items-center gap-3">
                    <Badge class={getStatusColor(project.status || 'active')}>
                      {project.status || 'active'}
                    </Badge>
                    <Badge class={getPhaseColor(project.currentPhase)}>
                      {project.currentPhase.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.completionPercentage}% Complete</span>
                    <Show when={project.startDate}>
                      <span class="flex items-center gap-1">
                        <Calendar class="w-4 h-4" />
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </Show>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <A href={`/projects/${project.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye class="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </A>
                  <A href={`/admin/projects/${project.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit class="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </A>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id)}
                    class="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 class="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            )}
          </For>
        </div>

        <Show when={projects().length === 0}>
          <Card class="p-12 text-center ff-card">
            <FolderOpen class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="ff-heading-medium text-card-foreground mb-2">No projects yet</h3>
            <p class="text-muted-foreground mb-6">
              Create your first project to get started
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              class="bg-primary text-primary-foreground"
            >
              <Plus class="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </Card>
        </Show>
      </section>
    </div>
  )
}

export default AdminProjects