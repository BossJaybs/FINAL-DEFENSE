import { Trophy, Clock, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
  title: string
  value: string
  unit: string
  change: string
  icon: "trophy" | "clock" | "target"
  showProgress?: boolean
  progress?: number
}

export function ProgressCard({
  title,
  value,
  unit,
  change,
  icon,
  showProgress = false,
  progress = 0,
}: ProgressCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        {icon === "trophy" && <Trophy className="w-full h-full" />}
        {icon === "clock" && <Clock className="w-full h-full" />}
        {icon === "target" && <Target className="w-full h-full" />}
      </div>

      <div className="flex justify-between items-start mb-4 relative">
        <h3 className="font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          {icon === "trophy" && <Trophy className="text-yellow-500 h-5 w-5" />}
          {icon === "clock" && <Clock className="text-blue-500 h-5 w-5" />}
          {icon === "target" && <Target className="text-purple-500 h-5 w-5" />}
        </div>
      </div>

      <div className="flex items-baseline">
        <span className="text-3xl font-bold dark:text-white">{value}</span>
        <span className="ml-1 text-gray-600 dark:text-gray-400">{unit}</span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{change}</div>

      {showProgress && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  )
}
