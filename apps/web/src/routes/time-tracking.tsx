import { Component, createSignal, For, Show } from "solid-js"
import { Card, Button, Input, Select } from "../components/ui"
import { Clock, Play, Pause, Square, Calendar, Timer } from "lucide-solid"

const TimeTrackingPage: Component = () => {
  const [isTracking, setIsTracking] = createSignal(false)
  const [currentTask, setCurrentTask] = createSignal("")
  const [elapsedTime, setElapsedTime] = createSignal(0)
  const [selectedProject, setSelectedProject] = createSignal("")

  // Mock time entries
  const timeEntries = [
    {
      id: "1",
      taskName: "Install fiber cables in Building A",
      projectName: "Business Park Installation",
      startTime: "09:00",
      endTime: "12:30",
      duration: "3h 30m",
      date: "2025-06-09",
      status: "completed"
    },
    {
      id: "2", 
      taskName: "Site survey for Building B",
      projectName: "Business Park Installation",
      startTime: "13:30",
      endTime: "16:15",
      duration: "2h 45m",
      date: "2025-06-09",
      status: "completed"
    },
    {
      id: "3",
      taskName: "Equipment testing and calibration",
      projectName: "Residential Complex Network",
      startTime: "08:15",
      endTime: "11:00",
      duration: "2h 45m",
      date: "2025-06-08",
      status: "completed"
    }
  ]

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTracking = () => {
    if (!currentTask()) {
      alert("Please select a task first")
      return
    }
    setIsTracking(true)
    // In a real app, start the timer here
  }

  const stopTracking = () => {
    setIsTracking(false)
    setElapsedTime(0)
    alert("Time entry saved!")
  }

  return (
    <div class="ff-page-container">
      <div class="ff-page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="ff-page-title">Time Tracking</h1>
            <p class="ff-page-subtitle">Track time spent on tasks and projects</p>
          </div>
        </div>
      </div>

      {/* Active Timer */}
      <Card class="p-6 ff-card mb-6">
        <h2 class="ff-section-title mb-4">Current Timer</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="ff-label mb-2 block">Project</label>
            <Select value={selectedProject()} onChange={setSelectedProject}>
              <option value="">Select project</option>
              <option value="project-1">Business Park Installation</option>
              <option value="project-2">Residential Complex Network</option>
              <option value="project-3">Office Building Upgrade</option>
            </Select>
          </div>
          
          <div>
            <label class="ff-label mb-2 block">Task</label>
            <Input
              placeholder="Enter task description"
              value={currentTask()}
              onInput={(e) => setCurrentTask(e.target.value)}
            />
          </div>
          
          <div class="flex items-end">
            <Show when={!isTracking()}>
              <Button onClick={startTracking} class="bg-green-600 text-white">
                <Play class="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            </Show>
            <Show when={isTracking()}>
              <Button onClick={stopTracking} class="bg-red-600 text-white">
                <Square class="w-4 h-4 mr-2" />
                Stop Timer
              </Button>
            </Show>
          </div>
        </div>

        <Show when={isTracking()}>
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Timer class="w-5 h-5 text-blue-600" />
                <span class="font-medium text-blue-900">Currently tracking: {currentTask()}</span>
              </div>
              <div class="text-2xl font-mono font-bold text-blue-900">
                {formatTime(elapsedTime())}
              </div>
            </div>
          </div>
        </Show>
      </Card>

      {/* Time Entries */}
      <section class="ff-section">
        <h2 class="ff-section-title">Recent Time Entries</h2>
        
        <div class="space-y-4">
          <For each={timeEntries}>
            {(entry) => (
              <Card class="p-4 ff-card">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <Clock class="w-4 h-4 text-muted-foreground" />
                      <h4 class="font-semibold text-card-foreground">{entry.taskName}</h4>
                    </div>
                    <p class="text-sm text-muted-foreground mb-2">{entry.projectName}</p>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        {entry.date}
                      </span>
                      <span>{entry.startTime} - {entry.endTime}</span>
                      <span class="font-medium text-card-foreground">{entry.duration}</span>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" class="text-red-600 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </For>
        </div>

        <Show when={timeEntries.length === 0}>
          <Card class="p-12 text-center ff-card">
            <Timer class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="ff-heading-medium text-card-foreground mb-2">No time entries yet</h3>
            <p class="text-muted-foreground mb-6">Start tracking time to see your entries here</p>
          </Card>
        </Show>
      </section>

      {/* Weekly Summary */}
      <Card class="p-6 ff-card mt-6">
        <h2 class="ff-section-title mb-4">This Week Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-card-foreground">32.5h</div>
            <div class="text-sm text-muted-foreground">Total Hours</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-card-foreground">8</div>
            <div class="text-sm text-muted-foreground">Tasks Completed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-card-foreground">3</div>
            <div class="text-sm text-muted-foreground">Projects Worked</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-card-foreground">4.1h</div>
            <div class="text-sm text-muted-foreground">Avg Per Day</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TimeTrackingPage