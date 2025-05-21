import { BookOpen, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  title: string
  duration: string
  date: string
  description: string
  progress: number
  priority?: "high" | "medium" | "low"
  isDragging?: boolean
  className?: string
}

export function ActivityItem({
  title,
  duration,
  date,
  description,
  progress,
  priority = "medium",
  isDragging = false,
  className,
}: ActivityItemProps) {
  const priorityColors = {
    high: "border-l-4 border-l-red-500",
    medium: "border-l-4 border-l-yellow-500",
    low: "border-l-4 border-l-blue-500",
  }

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border rounded-lg transition-all",
        priorityColors[priority],
        isDragging ? "shadow-md" : "hover:shadow-sm",
        className,
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <BookOpen className="h-5 w-5 text-blue-600" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <span
            className={`text-xs px-2 py-0.5 rounded ${progress >= 75 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
          >
            +{progress}%
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>{duration}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
          {priority === "high" && (
            <>
              <span className="mx-2">•</span>
              <span className="text-red-600 font-medium">High Priority</span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  )
}
