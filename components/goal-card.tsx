"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, Circle, Calendar, MoreHorizontal, Trash2, CheckSquare, Link2 } from "lucide-react"
import type { Activity, Milestone } from "@/context/app-context"
import Link from "next/link"

interface GoalCardProps {
  id: string
  title: string
  description: string
  deadline: string
  progress: number
  status: "on-track" | "at-risk" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  milestones: Milestone[]
  relatedActivities?: Activity[]
  onToggleMilestone: (goalId: string, milestoneIndex: number) => void
  onMarkComplete: (id: string) => void
  onDelete: (id: string) => void
}

export function GoalCard({
  id,
  title,
  description,
  deadline,
  progress,
  status,
  priority,
  milestones,
  relatedActivities = [],
  onToggleMilestone,
  onMarkComplete,
  onDelete,
}: GoalCardProps) {
  const [showActivities, setShowActivities] = useState(false)

  const statusColors = {
    "on-track": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "at-risk": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  const statusLabels = {
    "on-track": "On Track",
    "at-risk": "At Risk",
    "in-progress": "In Progress",
    completed: "Completed",
  }

  const statusIcons = {
    "on-track": <Circle className="h-4 w-4 text-green-500" />,
    "at-risk": <Circle className="h-4 w-4 text-red-500" />,
    "in-progress": <Circle className="h-4 w-4 text-blue-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  }

  // Function to handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      onDelete(id)
    }
  }

  return (
    <Card
      className={`border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${priority === "high" ? "border-l-4 border-l-red-500" : priority === "medium" ? "border-l-4 border-l-yellow-500" : "border-l-4 border-l-blue-500"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-start gap-2">
            {statusIcons[status]}
            <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[priority]}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMarkComplete(id)} disabled={status === "completed"}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark as Complete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Deadline: {deadline}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="dark:text-gray-300">{progress}% Complete</span>
            <span className={`px-2 py-0.5 rounded ${statusColors[status]}`}>{statusLabels[status]}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium dark:text-white">Milestones</h4>
          <ul className="space-y-1">
            {milestones.map((milestone, index) => (
              <li key={index} className="flex items-start text-sm">
                <Checkbox
                  id={`milestone-${id}-${index}`}
                  checked={milestone.completed}
                  onCheckedChange={() => onToggleMilestone(id, index)}
                />
                <Label
                  htmlFor={`milestone-${id}-${index}`}
                  className={`ml-2 cursor-pointer ${
                    milestone.completed ? "line-through text-gray-500 dark:text-gray-500" : "dark:text-gray-300"
                  }`}
                >
                  {milestone.title}
                </Label>
              </li>
            ))}
          </ul>
        </div>

        {relatedActivities.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex items-center p-0 h-auto"
              onClick={() => setShowActivities(!showActivities)}
            >
              <Link2 className="h-3 w-3 mr-1 text-indigo-500" />
              <span className="text-indigo-600">
                {showActivities ? "Hide related activities" : `Show ${relatedActivities.length} related activities`}
              </span>
            </Button>

            {showActivities && (
              <div className="mt-2 space-y-2">
                {relatedActivities.map((activity) => (
                  <Link
                    key={activity.id}
                    href="/activity"
                    className="block text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-gray-500 dark:text-gray-400 mt-1">
                      {activity.duration} • {activity.date}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full dark:text-white dark:hover:bg-gray-700"
          onClick={() => (status !== "completed" ? onMarkComplete(id) : null)}
          disabled={status === "completed"}
        >
          {status === "completed" ? "Completed" : "Update Progress"}
        </Button>
      </CardFooter>
    </Card>
  )
}
