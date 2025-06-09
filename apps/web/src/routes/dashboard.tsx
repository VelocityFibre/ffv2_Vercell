import { Component } from "solid-js"
import { Card } from "../components/ui"
import { Home, FolderOpen, CheckSquare, Users, Clock, AlertTriangle } from "lucide-solid"
import { A } from "@solidjs/router"

const Dashboard: Component = () => {
  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <h1 class="ff-page-title">Dashboard</h1>
        <p class="ff-page-subtitle">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Quick Stats */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <A href="/admin/projects">
          <Card class="p-6 ff-card cursor-pointer hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Active Projects</p>
                <p class="text-2xl font-bold text-foreground">8</p>
              </div>
              <FolderOpen class="w-8 h-8 text-primary" />
            </div>
          </Card>
        </A>

        <A href="/tasks/my-tasks">
          <Card class="p-6 ff-card cursor-pointer hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">My Tasks</p>
                <p class="text-2xl font-bold text-foreground">24</p>
              </div>
              <CheckSquare class="w-8 h-8 text-primary" />
            </div>
          </Card>
        </A>

        <A href="/admin/users">
          <Card class="p-6 ff-card cursor-pointer hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Team Members</p>
                <p class="text-2xl font-bold text-foreground">12</p>
              </div>
              <Users class="w-8 h-8 text-primary" />
            </div>
          </Card>
        </A>

        <A href="/tasks/my-tasks">
          <Card class="p-6 ff-card cursor-pointer hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Overdue Tasks</p>
                <p class="text-2xl font-bold text-destructive">3</p>
              </div>
              <AlertTriangle class="w-8 h-8 text-destructive" />
            </div>
          </Card>
        </A>
      </div>

      {/* Main Content */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card class="p-6 ff-card">
          <h2 class="ff-section-title mb-4">Recent Projects</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <FolderOpen class="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">Network Upgrade</h3>
                  <p class="text-sm text-muted-foreground">85% Complete</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-foreground">Due: Jun 30</p>
                <p class="text-xs text-muted-foreground">3 days left</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <FolderOpen class="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">Campus Installation</h3>
                  <p class="text-sm text-muted-foreground">45% Complete</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-foreground">Due: Aug 15</p>
                <p class="text-xs text-muted-foreground">47 days left</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <FolderOpen class="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">Fiber Repair</h3>
                  <p class="text-sm text-muted-foreground">12% Complete</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-foreground">Due: Jun 12</p>
                <p class="text-xs text-destructive">Overdue</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Urgent Tasks */}
        <Card class="p-6 ff-card">
          <h2 class="ff-section-title mb-4">Urgent Tasks</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle class="w-5 h-5 text-destructive flex-shrink-0" />
              <div class="flex-1">
                <h3 class="font-medium text-foreground">Site Survey Overdue</h3>
                <p class="text-sm text-muted-foreground">Network Upgrade Project</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-destructive">2 days overdue</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock class="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div class="flex-1">
                <h3 class="font-medium text-foreground">Permit Submission</h3>
                <p class="text-sm text-muted-foreground">Campus Installation</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-yellow-600">Due today</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
              <CheckSquare class="w-5 h-5 text-primary flex-shrink-0" />
              <div class="flex-1">
                <h3 class="font-medium text-foreground">Equipment Testing</h3>
                <p class="text-sm text-muted-foreground">Fiber Repair Project</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-foreground">Due tomorrow</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard