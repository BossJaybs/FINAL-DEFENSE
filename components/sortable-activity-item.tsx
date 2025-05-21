"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SortableActivityItem({ activity, goalInfo }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  })

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
              {goalInfo}
            </div>
            <Badge variant="outline" className={priorityColors[activity.priority]}>
              {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} Priority
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{activity.description}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-gray-700 dark:text-gray-300">{activity.progress}%</span>
            </div>
            <Progress value={activity.progress} className="h-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
