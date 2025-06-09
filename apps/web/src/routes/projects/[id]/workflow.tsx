import { Component } from "solid-js"
import { useParams } from "@solidjs/router"
import { WorkflowManagement } from "../../../components/workflow"
import type { User } from "../../../../packages/shared/types"

// Mock current user - in real app this would come from auth context
const mockUser: User = {
  id: "user-789",
  email: "jane.manager@example.com",
  name: "Jane Manager", 
  role: "project_manager"
}

const WorkflowPage: Component = () => {
  const params = useParams()
  
  return (
    <div class="container mx-auto px-4 py-8">
      <WorkflowManagement 
        projectId={params.id}
        currentUser={mockUser}
      />
    </div>
  )
}

export default WorkflowPage