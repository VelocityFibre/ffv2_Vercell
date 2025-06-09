import { Component } from "solid-js"
import { MyTasksDashboard } from "../../components/workflow"
import type { User } from "../../../packages/shared/types"

// Mock current user - in real app this would come from auth context
const mockUser: User = {
  id: "user-123",
  email: "john.doe@example.com", 
  name: "John Doe",
  role: "field_technician"
}

const MyTasksPage: Component = () => {
  return (
    <div class="container mx-auto px-4 py-8">
      <MyTasksDashboard currentUser={mockUser} />
    </div>
  )
}

export default MyTasksPage