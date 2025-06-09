import { Component, createSignal, For, Show } from "solid-js"
import { A } from "@solidjs/router"
import { Card, Button, Badge, Input } from "../../components/ui"
import { Eye, Calendar, FolderOpen } from "lucide-solid"
import { mockAPI } from "../../lib/mockData"
import type { Project } from "../../types"

const ProjectsPage: Component = () => {
  const allProjects = mockAPI.getAllProjects()
  console.log('ProjectsPage - getAllProjects():', allProjects)
  console.log('ProjectsPage - projects length:', allProjects?.length)
  
  const [projects] = createSignal<Project[]>(allProjects || [])
  const [searchTerm, setSearchTerm] = createSignal("")

  const filteredProjects = () => {
    const term = searchTerm().toLowerCase()
    if (!term) return projects()
    return projects().filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.currentPhase.toLowerCase().includes(term)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "on_hold": return "bg-yellow-100 text-yellow-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning": return "bg-purple-100 text-purple-800"
      case "design": return "bg-blue-100 text-blue-800"
      case "implementation": return "bg-orange-100 text-orange-800"
      case "testing": return "bg-yellow-100 text-yellow-800"
      case "deployment": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">My Projects</h1>
            <p class="ff-page-subtitle">View and manage your assigned projects</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <Input
          placeholder="Search projects..."
          value={searchTerm()}
          onInput={(e) => setSearchTerm(e.target.value)}
          class="max-w-md"
        />
      </div>

      {/* Projects List */}
      <section class="ff-section">
        <h2 class="ff-section-title">All Projects ({filteredProjects().length})</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <For each={filteredProjects()}>
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
                  <A href={`/projects/${project.id}/timeline`}>
                    <Button size="sm" variant="outline">
                      Timeline
                    </Button>
                  </A>
                  <A href={`/projects/${project.id}/workflow`}>
                    <Button size="sm" variant="outline">
                      Workflow
                    </Button>
                  </A>
                </div>
              </Card>
            )}
          </For>
        </div>

        <Show when={filteredProjects().length === 0}>
          <Card class="p-12 text-center ff-card">
            <FolderOpen class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="ff-heading-medium text-card-foreground mb-2">No projects found</h3>
            <p class="text-muted-foreground mb-6">
              {searchTerm() ? `No projects match "${searchTerm()}"` : "You are not assigned to any projects yet"}
            </p>
          </Card>
        </Show>
      </section>
    </div>
  )
}

export default ProjectsPage