"use client"
import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { GripVertical } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Badge } from "@/components/ui/badge"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"

// Sortable activity item component
function SortableActivityItem({ activity, goals }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  })

  // Find the related goal for this activity
  const relatedGoal = activity.goalId ? goals.find((goal) => goal.id === activity.goalId) : null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    medium:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    low: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  }

  const getFormattedProgress = (activityProgress) => {
    if (relatedGoal) {
      return `${activityProgress}% (Goal: ${relatedGoal.progress}%)`
    }
    return `${activityProgress}%`
  }

  // Get progress bar colors based on progress value
  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500 dark:bg-green-400"
    if (progress >= 50) return "bg-blue-500 dark:bg-blue-400"
    if (progress >= 25) return "bg-yellow-500 dark:bg-yellow-400"
    return "bg-red-500 dark:bg-red-400"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm ${
        isDragging ? "shadow-md" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {activity.duration} • {activity.date}
              </div>
            </div>
            <Badge variant="outline" className={priorityColors[activity.priority]}>
              {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} Priority
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{activity.description}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className={`text-gray-700 dark:text-gray-300 ${relatedGoal ? "flex items-center gap-1" : ""}`}>
                {getFormattedProgress(activity.progress)}
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
              {/* Goal progress bar (background) */}
              {relatedGoal && (
                <div
                  className={`absolute h-3 opacity-30 ${getProgressColor(relatedGoal.progress)}`}
                  style={{ width: `${relatedGoal.progress}%` }}
                ></div>
              )}

              {/* Activity progress bar (foreground) */}
              <div
                className={`h-3 rounded-full transition-all duration-300 relative z-10 ${getProgressColor(activity.progress)}`}
                style={{ width: `${activity.progress}%` }}
                role="progressbar"
                aria-valuenow={activity.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {/* Optional: Add a small indicator where the bars meet */}
                {relatedGoal && activity.progress < relatedGoal.progress && (
                  <div className="absolute right-0 top-0 h-full w-1 bg-white dark:bg-gray-900 opacity-50"></div>
                )}
              </div>
            </div>

            {/* Legend for the progress bars */}
            {relatedGoal && (
              <div className="flex justify-end mt-1 text-xs">
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-1 opacity-30"></span>
                  Goal
                </span>
                <span className="flex items-center text-gray-500 dark:text-gray-400 ml-2">
                  <span className="inline-block w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full mr-1"></span>
                  Activity
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActivityPage() {
  const { activities, goals, setActivities } = useAppContext()
  const [localActivities, setLocalActivities] = useState([])
  const [overallProgress, setOverallProgress] = useState(0)

  // Calculate overall progress of active goals
  useEffect(() => {
    if (goals.length === 0) {
      setOverallProgress(0)
      return
    }

    // Filter active goals (not completed)
    const activeGoals = goals.filter((goal) => goal.status !== "completed")

    if (activeGoals.length === 0) {
      setOverallProgress(100) // All goals are completed
      return
    }

    // Calculate average progress of active goals
    const totalProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0)
    const averageProgress = Math.round(totalProgress / activeGoals.length)

    setOverallProgress(averageProgress)
  }, [goals])

  // Filter out activities related to completed or deleted goals
  useEffect(() => {
    const filtered = activities.filter((activity) => {
      // If the activity has no goalId, keep it
      if (!activity.goalId) return true

      // Check if the goal exists and is not completed
      const relatedGoal = goals.find((goal) => goal.id === activity.goalId)
      return relatedGoal && relatedGoal.status !== "completed"
    })

    setLocalActivities(filtered)
  }, [activities, goals])

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setLocalActivities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        // Create a new array with the item moved to the new position
        const newItems = [...items]
        const [movedItem] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, movedItem)

        // Update the global activities state
        setActivities((prev) => {
          // Create a map of the new order
          const orderMap = new Map(newItems.map((item, index) => [item.id, index]))

          // Sort the original activities array based on the new order
          return [...prev].sort((a, b) => {
            const aIndex = orderMap.has(a.id) ? orderMap.get(a.id) : Number.POSITIVE_INFINITY
            const bIndex = orderMap.has(b.id) ? orderMap.get(b.id) : Number.POSITIVE_INFINITY
            return aIndex - bIndex
          })
        })

        return newItems
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity History</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Activity Progress Header - Removed "Recent Learning Activities" text */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <span className="font-medium">Activity Progress</span>
            <span className="font-bold">{overallProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 h-1">
            <div className="bg-blue-500 h-1 transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Drag items to reorder by priority</div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={localActivities.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {localActivities.map((activity) => (
                    <SortableActivityItem key={activity.id} activity={activity} goals={goals} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  )
}
