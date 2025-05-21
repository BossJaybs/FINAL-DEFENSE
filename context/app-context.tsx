"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define types for our data
export interface Milestone {
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  deadline: string
  progress: number
  status: "on-track" | "at-risk" | "in-progress" | "completed"
  milestones: Milestone[]
  priority: "high" | "medium" | "low"
}

export interface Activity {
  id: string
  title: string
  duration: string
  date: string
  description: string
  progress: number
  priority: "high" | "medium" | "low"
  goalId?: string // Reference to the related goal
}

interface AppContextType {
  goals: Goal[]
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>
  activities: Activity[]
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
  createActivityFromGoal: (goal: Goal) => void
  updateGoalProgress: (goalId: string, progressIncrement: number) => void
}

// Initial sample data
const initialGoals: Goal[] = []

// Sample activities data
const initialActivities: Activity[] = []

// Create the context with a default value
const AppContext = createContext<AppContextType>({
  goals: initialGoals,
  setGoals: () => {},
  activities: initialActivities,
  setActivities: () => {},
  createActivityFromGoal: () => {},
  updateGoalProgress: () => {},
})

// Create a provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [isInitialized, setIsInitialized] = useState(false)

  // Function to update a goal's progress
  const updateGoalProgress = (goalId: string, progressIncrement: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          // Calculate new progress, ensuring it stays between 0-100
          const newProgress = Math.min(100, Math.max(0, goal.progress + progressIncrement))

          // Update status based on progress
          let newStatus = goal.status
          if (newProgress >= 100) {
            newStatus = "completed"
          } else if (newProgress >= 75) {
            newStatus = "on-track"
          } else if (newProgress >= 25) {
            newStatus = "in-progress"
          } else {
            newStatus = "at-risk"
          }

          return {
            ...goal,
            progress: newProgress,
            status: newStatus,
          }
        }
        return goal
      }),
    )
  }

  // Function to create a new activity from a goal
  const createActivityFromGoal = (goal: Goal) => {
    // Format current date and time
    const now = new Date()
    const formattedDate = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    // Create a new activity based on the goal
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      title: goal.title,
      duration: "30 minutes", // Default duration
      date: formattedDate,
      description: `Started working on: ${goal.description}`,
      progress: 0, // Start with 0% progress
      priority: goal.priority,
      goalId: goal.id,
    }

    // Add the new activity to the activities list
    setActivities((prev) => [newActivity, ...prev])
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedGoals = localStorage.getItem("goals")
        const savedActivities = localStorage.getItem("activities")

        if (savedGoals) {
          setGoals(JSON.parse(savedGoals))
        }

        if (savedActivities) {
          setActivities(JSON.parse(savedActivities))
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      } finally {
        setIsInitialized(true)
      }
    } else {
      setIsInitialized(true)
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      try {
        localStorage.setItem("goals", JSON.stringify(goals))
        localStorage.setItem("activities", JSON.stringify(activities))
      } catch (error) {
        console.error("Error saving data to localStorage:", error)
      }
    }
  }, [goals, activities, isInitialized])

  return (
    <AppContext.Provider
      value={{
        goals,
        setGoals,
        activities,
        setActivities,
        createActivityFromGoal,
        updateGoalProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
