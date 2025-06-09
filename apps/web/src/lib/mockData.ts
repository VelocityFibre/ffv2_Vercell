// Mock data for FibreFlow V2 authentication and testing

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'project_manager' | 'field_technician' | 'client'
  password: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  clientId: string
  managerId: string
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Hein van Vuuren',
    email: 'admin@velocityfibre.co.za',
    role: 'admin',
    password: 'password'
  },
  {
    id: '2',
    name: 'Project Manager',
    email: 'pm@velocityfibre.co.za',
    role: 'project_manager',
    password: 'password'
  },
  {
    id: '3',
    name: 'Field Technician',
    email: 'tech@velocityfibre.co.za',
    role: 'field_technician',
    password: 'password'
  },
  {
    id: '4',
    name: 'Client User',
    email: 'client@example.com',
    role: 'client',
    password: 'password'
  }
]

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Fiber Installation - Cape Town CBD',
    description: 'High-speed fiber installation for commercial district',
    status: 'active',
    progress: 65,
    clientId: '4',
    managerId: '2'
  },
  {
    id: '2',
    name: 'Residential Fiber - Stellenbosch',
    description: 'Fiber network deployment for residential area',
    status: 'planning',
    progress: 25,
    clientId: '4',
    managerId: '2'
  }
]

export const mockData = {
  users: mockUsers,
  projects: mockProjects,
  login: (email: string, password: string): { success: boolean; user?: User; error?: string } => {
    const user = mockUsers.find(u => u.email === email)
    if (!user) return { success: false, error: "User not found" }
    if (user.password !== password) return { success: false, error: "Invalid password" }
    return { success: true, user }
  },
  getAllUsers: () => mockUsers,
  getAllProjects: () => mockProjects,
  getAllTasks: () => []
}

export const mockAPI = mockData