"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, CheckCircle, Circle } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { useLanguage } from "@/context/language-context"

export function LearningGoals() {
  const router = useRouter()
  const { goals } = useAppContext()
  const { t } = useLanguage()

  // Sort goals by most recently added (assuming newer goals have higher IDs)
  // and limit to 3 for the dashboard
  const recentGoals = [...goals].sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id)).slice(0, 3)

  const handleAddGoal = () => {
    router.push("/goals")
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium dark:text-white">{t.dashboard.learningGoals}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleAddGoal}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {t.dashboard.addGoal}
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t.dashboard.noGoals}</p>
          <Button variant="outline" onClick={handleAddGoal} className="dark:text-gray-300 dark:hover:bg-gray-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t.dashboard.createFirstGoal}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {recentGoals.map((goal) => (
            <div
              key={goal.id}
              className="space-y-1 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  {goal.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : goal.status === "at-risk" ? (
                    <Circle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium dark:text-white">{goal.title}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        goal.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : goal.status === "at-risk"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {goal.status === "completed"
                        ? t.goals.completed
                        : goal.status === "at-risk"
                          ? t.goals.atRisk
                          : t.goals.inProgress}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.goals.deadline}: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="dark:text-gray-300">
                        {goal.progress}% {t.goals.completed}
                      </span>
                      <span className="dark:text-gray-300">
                        {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} Milestones
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {goals.length > 3 && (
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleAddGoal}
            >
              {t.dashboard.viewAll} {goals.length} {t.dashboard.learningGoals.toLowerCase()}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
