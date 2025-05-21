"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Circle, Clock, Plus, Edit, Trash2, AlertCircle, CheckSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BackButton } from "@/components/back-button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAppContext } from "@/context/app-context"
import { GoalCard } from "@/components/goal-card"

// Define the goal type
interface Milestone {
  title: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  deadline: string
  progress: number
  status: "on-track" | "at-risk" | "in-progress" | "completed"
  milestones: Milestone[]
  priority: "high" | "medium" | "low"
}

export default function GoalsPage() {
  const { toast } = useToast()
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get context
  const { goals, setGoals, activities, setActivities, createActivityFromGoal } = useAppContext()

  // Form state
  const emptyGoalForm = {
    title: "",
    description: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
    milestones: [""] as string[],
  }

  const [newGoal, setNewGoal] = useState(emptyGoalForm)
  const [editGoal, setEditGoal] = useState(emptyGoalForm)

  useEffect(() => {
    // Set loading to false after a short delay to ensure context is loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    formSetter: React.Dispatch<React.SetStateAction<typeof emptyGoalForm>>,
  ) => {
    const { id, value } = e.target
    formSetter((prev) => ({ ...prev, [id]: value }))
  }

  // Handle milestone input changes
  const handleMilestoneChange = (
    index: number,
    value: string,
    formSetter: React.Dispatch<React.SetStateAction<typeof emptyGoalForm>>,
    formState: typeof emptyGoalForm,
  ) => {
    const updatedMilestones = [...formState.milestones]
    updatedMilestones[index] = value
    formSetter((prev) => ({ ...prev, milestones: updatedMilestones }))
  }

  // Add new milestone field
  const addMilestoneField = (
    formSetter: React.Dispatch<React.SetStateAction<typeof emptyGoalForm>>,
    formState: typeof emptyGoalForm,
  ) => {
    formSetter((prev) => ({ ...prev, milestones: [...prev.milestones, ""] }))
  }

  // Remove milestone field
  const removeMilestoneField = (
    index: number,
    formSetter: React.Dispatch<React.SetStateAction<typeof emptyGoalForm>>,
    formState: typeof emptyGoalForm,
  ) => {
    const updatedMilestones = [...formState.milestones]
    updatedMilestones.splice(index, 1)
    formSetter((prev) => ({ ...prev, milestones: updatedMilestones }))
  }

  // Create new goal
  const handleCreateGoal = () => {
    // Validate form
    if (!newGoal.title || !newGoal.deadline) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new goal object
    const newGoalObj: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      deadline: newGoal.deadline,
      progress: 0,
      status: "in-progress",
      priority: newGoal.priority,
      milestones: newGoal.milestones.filter((m) => m.trim() !== "").map((title) => ({ title, completed: false })),
    }

    // Add to goals list
    setGoals((prev) => [newGoalObj, ...prev])

    // Create a corresponding activity
    createActivityFromGoal(newGoalObj)

    // Reset form
    setNewGoal(emptyGoalForm)

    // Close dialog
    setIsAddGoalOpen(false)

    // Switch to active tab to see the new goal
    setActiveTab("active")

    toast({
      title: "Goal created",
      description: "Your new learning goal has been created successfully.",
    })
  }

  // Open edit goal dialog
  const openEditGoalDialog = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    setEditGoal({
      title: goal.title,
      description: goal.description,
      deadline: goal.deadline,
      priority: goal.priority,
      milestones: goal.milestones.map((m) => m.title),
    })

    setSelectedGoalId(goalId)
    setIsEditGoalOpen(true)
  }

  // Update existing goal
  const handleUpdateGoal = () => {
    if (!selectedGoalId) return

    // Validate form
    if (!editGoal.title || !editGoal.deadline) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setGoals((prev) => {
      const updatedGoals = prev.map((goal) => {
        if (goal.id === selectedGoalId) {
          // Preserve completed status of existing milestones
          const existingMilestones = goal.milestones
          const updatedMilestones = editGoal.milestones
            .filter((m) => m.trim() !== "")
            .map((title) => {
              // Check if this milestone already exists
              const existing = existingMilestones.find((m) => m.title === title)
              return existing || { title, completed: false }
            })

          return {
            ...goal,
            title: editGoal.title,
            description: editGoal.description,
            deadline: editGoal.deadline,
            priority: editGoal.priority,
            milestones: updatedMilestones,
          }
        }
        return goal
      })

      return updatedGoals
    })

    // Reset form and state
    setEditGoal(emptyGoalForm)
    setSelectedGoalId(null)
    setIsEditGoalOpen(false)

    toast({
      title: "Goal updated",
      description: "Your learning goal has been updated successfully.",
    })
  }

  // Mark goal as complete
  const markGoalAsComplete = (goalId: string) => {
    setGoals((prev) => {
      return prev.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            status: "completed",
            progress: 100,
            milestones: goal.milestones.map((m) => ({ ...m, completed: true })),
          }
        }
        return goal
      })
    })

    // Update any activities related to this goal to show 100% progress
    setActivities((prev) => {
      return prev.map((activity) => {
        if (activity.goalId === goalId) {
          return {
            ...activity,
            progress: 100,
            description: `Completed: ${activity.description}`,
          }
        }
        return activity
      })
    })

    toast({
      title: "Goal completed",
      description: "Congratulations on completing your learning goal!",
    })
  }

  const handleToggleMilestone = (goalId: string, milestoneIndex: number) => {
    setGoals((prev) => {
      return prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = [...goal.milestones]
          updatedMilestones[milestoneIndex] = {
            ...updatedMilestones[milestoneIndex],
            completed: !updatedMilestones[milestoneIndex].completed,
          }

          // Calculate new progress based on completed milestones
          const completedCount = updatedMilestones.filter((m) => m.completed).length
          const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)

          // Update goal status based on progress
          let newStatus = goal.status
          if (newProgress === 100) {
            newStatus = "completed"
          } else if (newProgress >= 70) {
            newStatus = "on-track"
          } else if (newProgress >= 30) {
            newStatus = "in-progress"
          } else {
            newStatus = "at-risk"
          }

          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress,
            status: newStatus,
          }
        }
        return goal
      })
    })

    toast({
      title: "Progress updated",
      description: "Your milestone progress has been saved.",
    })
  }

  // Delete goal directly without confirmation dialog
  const deleteGoal = useCallback(
    (goalId: string) => {
      // Simple direct deletion without dialog
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
      setSelectedGoals((prev) => prev.filter((id) => id !== goalId))

      // Also remove any activities related to this goal
      setActivities((prev) => prev.filter((activity) => activity.goalId !== goalId))

      toast({
        title: "Goal deleted",
        description: "Your learning goal has been deleted.",
      })
    },
    [toast, setGoals, setActivities],
  )

  // Select/deselect all goals
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGoals(filteredGoals.map((goal) => goal.id))
    } else {
      setSelectedGoals([])
    }
  }

  // Select/deselect individual goal
  const handleSelectGoal = (goalId: string, checked: boolean) => {
    if (checked) {
      setSelectedGoals((prev) => [...prev, goalId])
    } else {
      setSelectedGoals((prev) => prev.filter((id) => id !== goalId))
    }
  }

  // Delete selected goals
  const deleteSelectedGoals = () => {
    if (selectedGoals.length === 0) return

    if (
      window.confirm(`Are you sure you want to delete ${selectedGoals.length} goals? This action cannot be undone.`)
    ) {
      setGoals((prev) => prev.filter((goal) => !selectedGoals.includes(goal.id)))

      // Remove activities related to any of the selected goals
      setActivities((prev) => prev.filter((activity) => !selectedGoals.includes(activity.goalId || "")))

      setSelectedGoals([])

      toast({
        title: "Goals deleted",
        description: `Successfully deleted ${selectedGoals.length} goals.`,
      })
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Filter goals based on active tab
  const filteredGoals = goals.filter((goal) => {
    if (activeTab === "active") return goal.status !== "completed"
    if (activeTab === "completed") return goal.status === "completed"
    return true // "all" tab
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Learning Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Set, track, and achieve your learning objectives</p>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Learning Goal</DialogTitle>
              <DialogDescription>
                Define your learning objective, set a deadline, and track your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Goal Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Course"
                  value={newGoal.title}
                  onChange={(e) => handleInputChange(e, setNewGoal)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to achieve and why it's important"
                  className="min-h-[100px]"
                  value={newGoal.description}
                  onChange={(e) => handleInputChange(e, setNewGoal)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">
                    Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => handleInputChange(e, setNewGoal)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={newGoal.priority}
                    onChange={(e) => handleInputChange(e, setNewGoal)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Milestones (optional)</Label>
                <div className="space-y-2">
                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`e.g., Milestone ${index + 1}`}
                        value={milestone}
                        onChange={(e) => handleMilestoneChange(index, e.target.value, setNewGoal, newGoal)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeMilestoneField(index, setNewGoal, newGoal)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => addMilestoneField(setNewGoal, newGoal)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Milestone
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleCreateGoal}
              >
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Goal Dialog */}
        <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Learning Goal</DialogTitle>
              <DialogDescription>Update your learning objective, deadline, or milestones.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Goal Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete React Course"
                  value={editGoal.title}
                  onChange={(e) => handleInputChange(e, setEditGoal)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to achieve and why it's important"
                  className="min-h-[100px]"
                  value={editGoal.description}
                  onChange={(e) => handleInputChange(e, setEditGoal)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">
                    Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={editGoal.deadline}
                    onChange={(e) => handleInputChange(e, setEditGoal)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={editGoal.priority}
                    onChange={(e) => handleInputChange(e, setEditGoal)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Milestones</Label>
                <div className="space-y-2">
                  {editGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`e.g., Milestone ${index + 1}`}
                        value={milestone}
                        onChange={(e) => handleMilestoneChange(index, e.target.value, setEditGoal, editGoal)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeMilestoneField(index, setEditGoal, editGoal)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => addMilestoneField(setEditGoal, editGoal)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Milestone
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditGoalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={handleUpdateGoal}
              >
                Update Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Goals</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                description={goal.description}
                deadline={formatDate(goal.deadline)}
                progress={goal.progress}
                status={goal.status}
                priority={goal.priority}
                milestones={goal.milestones}
                relatedActivities={activities.filter((a) => a.goalId === goal.id)}
                onToggleMilestone={handleToggleMilestone}
                onMarkComplete={markGoalAsComplete}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                description={goal.description}
                deadline={formatDate(goal.deadline)}
                progress={goal.progress}
                status={goal.status}
                priority={goal.priority}
                milestones={goal.milestones}
                relatedActivities={activities.filter((a) => a.goalId === goal.id)}
                onToggleMilestone={handleToggleMilestone}
                onMarkComplete={markGoalAsComplete}
                onDelete={deleteGoal}
              />
            ))}

            {filteredGoals.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400 text-center">
                  <p>No completed goals yet</p>
                  <p className="text-sm mt-1">Complete your active goals to see them here</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium dark:text-white">All Learning Goals</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedGoals.length > 0 && selectedGoals.length === filteredGoals.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">
                    Select All
                  </Label>
                </div>
                {selectedGoals.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelectedGoals}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedGoals.length})
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium dark:text-white">Goal</th>
                    <th className="text-left py-3 px-4 font-medium dark:text-white">Deadline</th>
                    <th className="text-left py-3 px-4 font-medium dark:text-white">Progress</th>
                    <th className="text-left py-3 px-4 font-medium dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal) => (
                    <tr key={goal.id} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedGoals.includes(goal.id)}
                            onCheckedChange={(checked) => handleSelectGoal(goal.id, !!checked)}
                          />
                          {goal.title}
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-white">{formatDate(goal.deadline)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={goal.progress} className="h-2 w-24" />
                          <span className="text-sm dark:text-white">{goal.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            goal.status === "on-track"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : goal.status === "at-risk"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : goal.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {goal.status === "on-track" && <Circle className="h-4 w-4 text-green-500 mr-1" />}
                          {goal.status === "at-risk" && <AlertCircle className="h-4 w-4 text-red-500 mr-1" />}
                          {goal.status === "in-progress" && <Clock className="h-4 w-4 text-blue-500 mr-1" />}
                          {goal.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                          <span>
                            {goal.status === "on-track"
                              ? "On Track"
                              : goal.status === "at-risk"
                                ? "At Risk"
                                : goal.status === "in-progress"
                                  ? "In Progress"
                                  : "Completed"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 dark:text-white dark:hover:bg-gray-700"
                            onClick={() => openEditGoalDialog(goal.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 dark:text-white dark:hover:bg-gray-700"
                            onClick={() => markGoalAsComplete(goal.id)}
                            disabled={goal.status === "completed"}
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-500 hover:text-red-700 dark:hover:bg-gray-700"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this goal? This action cannot be undone.",
                                )
                              ) {
                                deleteGoal(goal.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredGoals.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No goals found</p>
                  <Button onClick={() => setIsAddGoalOpen(true)} variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first goal
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
