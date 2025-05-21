"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, Activity } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAppContext } from "@/context/app-context"

// Define types for our chart data
interface ChartDataPoint {
  name: string
  value: number
  [key: string]: any
}

// Sample data to use when real data is not available
const sampleDailyData: ChartDataPoint[] = [
  { name: "Mon", value: 2.5 },
  { name: "Tue", value: 1.8 },
  { name: "Wed", value: 2.2 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 3.0 },
  { name: "Sat", value: 2.8 },
  { name: "Sun", value: 3.2 },
]

const sampleWeeklyData: ChartDataPoint[] = [
  { name: "Week 1", value: 12.5 },
  { name: "Week 2", value: 15.2 },
  { name: "Week 3", value: 10.8 },
  { name: "Week 4", value: 18.5 },
]

const sampleTypeData: ChartDataPoint[] = [
  { name: "Programming", value: 8.5 },
  { name: "Language", value: 6.2 },
  { name: "Math", value: 4.8 },
  { name: "Science", value: 3.5 },
  { name: "History", value: 2.0 },
]

export function ProgressCharts() {
  const { t } = useLanguage()
  const appContext = useAppContext()

  // Initialize with sample data
  const [dailyData, setDailyData] = useState<ChartDataPoint[]>(sampleDailyData)
  const [weeklyData, setWeeklyData] = useState<ChartDataPoint[]>(sampleWeeklyData)
  const [typeData, setTypeData] = useState<ChartDataPoint[]>(sampleTypeData)

  // Generate data for all charts
  useEffect(() => {
    // Safety check - if context is not available, use sample data
    if (!appContext || !appContext.activities || !appContext.goals) {
      return
    }

    const { activities, goals } = appContext

    // Generate daily activity data (last 7 days)
    const generateDailyData = () => {
      try {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const result: ChartDataPoint[] = []

        // If we have real activities, use them
        if (activities && activities.length > 0) {
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dayIndex = date.getDay()
            const dayName = dayNames[dayIndex]

            // Filter activities for this day
            const dayActivities = activities.filter((activity) => {
              if (!activity || !activity.date) return false

              try {
                const activityDate = new Date(activity.date)
                return (
                  activityDate.getDate() === date.getDate() &&
                  activityDate.getMonth() === date.getMonth() &&
                  activityDate.getFullYear() === date.getFullYear()
                )
              } catch (e) {
                return false
              }
            })

            // Calculate total hours
            const hours = dayActivities.reduce((total, activity) => {
              if (!activity || !activity.duration) return total

              try {
                const durationMatch = activity.duration.match(/(\d+(\.\d+)?)/)
                if (durationMatch) {
                  const value = Number.parseFloat(durationMatch[1])
                  if (activity.duration.includes("hour")) {
                    return total + value
                  } else if (activity.duration.includes("minute")) {
                    return total + value / 60
                  }
                }
              } catch (e) {
                // Ignore parsing errors
              }
              return total
            }, 0)

            result.push({ name: dayName, value: Number(hours.toFixed(1)) })
          }
          return result
        } else {
          // Use sample data if no activities
          return sampleDailyData
        }
      } catch (e) {
        console.error("Error generating daily data:", e)
        return sampleDailyData
      }
    }

    // Generate weekly trends data (last 4 weeks)
    const generateWeeklyData = () => {
      try {
        // If we have real activities, calculate weekly totals
        if (activities && activities.length > 0) {
          const result: ChartDataPoint[] = []
          const now = new Date()

          for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now)
            weekStart.setDate(now.getDate() - i * 7 - now.getDay())

            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 6)

            // Filter activities for this week
            const weekActivities = activities.filter((activity) => {
              if (!activity || !activity.date) return false

              try {
                const activityDate = new Date(activity.date)
                return activityDate >= weekStart && activityDate <= weekEnd
              } catch (e) {
                return false
              }
            })

            // Calculate total hours
            const hours = weekActivities.reduce((total, activity) => {
              if (!activity || !activity.duration) return total

              try {
                const durationMatch = activity.duration.match(/(\d+(\.\d+)?)/)
                if (durationMatch) {
                  const value = Number.parseFloat(durationMatch[1])
                  if (activity.duration.includes("hour")) {
                    return total + value
                  } else if (activity.duration.includes("minute")) {
                    return total + value / 60
                  }
                }
              } catch (e) {
                // Ignore parsing errors
              }
              return total
            }, 0)

            const weekLabel = `Week ${4 - i}`
            result.push({
              name: weekLabel,
              value: Number(hours.toFixed(1)),
              total: weekActivities.length,
              avg: weekActivities.length ? Number((hours / weekActivities.length).toFixed(1)) : 0,
            })
          }

          return result
        } else {
          // Use sample data if no activities
          return sampleWeeklyData
        }
      } catch (e) {
        console.error("Error generating weekly data:", e)
        return sampleWeeklyData
      }
    }

    // Generate time by type data (categorized by goal type)
    const generateTypeData = () => {
      try {
        // If we have real goals and activities, categorize by goal
        if (goals && goals.length > 0 && activities && activities.length > 0) {
          const goalMap = new Map<string, number>()

          // Group activities by goal
          activities.forEach((activity) => {
            if (!activity) return

            if (activity.goalId) {
              const goal = goals.find((g) => g && g.id === activity.goalId)
              if (goal && goal.title) {
                const goalTitle = goal.title.length > 15 ? goal.title.substring(0, 15) + "..." : goal.title
                const hours = goalMap.get(goalTitle) || 0

                // Calculate hours from duration
                if (activity.duration) {
                  try {
                    const durationMatch = activity.duration.match(/(\d+(\.\d+)?)/)
                    if (durationMatch) {
                      const value = Number.parseFloat(durationMatch[1])
                      if (activity.duration.includes("hour")) {
                        goalMap.set(goalTitle, hours + value)
                      } else if (activity.duration.includes("minute")) {
                        goalMap.set(goalTitle, hours + value / 60)
                      }
                    }
                  } catch (e) {
                    // Ignore parsing errors
                  }
                }
              }
            }
          })

          // Convert map to array
          const result: ChartDataPoint[] = []
          goalMap.forEach((value, name) => {
            result.push({ name, value: Number(value.toFixed(1)) })
          })

          // Sort by hours (descending)
          result.sort((a, b) => b.value - a.value)

          // Take top 5 if there are more
          return result.length > 0 ? result.slice(0, 5) : sampleTypeData
        } else {
          // Use sample data if no goals or activities
          return sampleTypeData
        }
      } catch (e) {
        console.error("Error generating type data:", e)
        return sampleTypeData
      }
    }

    // Set the data with proper error handling
    try {
      setDailyData(generateDailyData())
      setWeeklyData(generateWeeklyData())
      setTypeData(generateTypeData())
    } catch (e) {
      console.error("Error setting chart data:", e)
      // Fallback to sample data if there's an error
      setDailyData(sampleDailyData)
      setWeeklyData(sampleWeeklyData)
      setTypeData(sampleTypeData)
    }
  }, [appContext])

  // Ensure we have valid data before rendering
  const safeDaily = dailyData && dailyData.length > 0 ? dailyData : sampleDailyData
  const safeWeekly = weeklyData && weeklyData.length > 0 ? weeklyData : sampleWeeklyData
  const safeType = typeData && typeData.length > 0 ? typeData : sampleTypeData

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
          <Activity className="h-5 w-5 text-indigo-500" />
          {t.dashboard.learningProgress}
        </h3>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700 p-1">
          <TabsTrigger
            value="daily"
            className="flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            <BarChart className="h-4 w-4" />
            <span>{t.dashboard.dailyActivity}</span>
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
          >
            <LineChart className="h-4 w-4" />
            <span>{t.dashboard.weeklyTrends}</span>
          </TabsTrigger>
          <TabsTrigger value="byType" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">
            {t.dashboard.timeByType}
          </TabsTrigger>
        </TabsList>

        <div className="h-64 border border-gray-100 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
          <TabsContent value="daily" className="w-full h-full">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hours Spent Learning (Last 7 Days)</div>
            <div className="h-56">
              {/* Line chart for daily activity */}
              <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {/* X and Y axes */}
                <line x1="50" y1="220" x2="550" y2="220" stroke="#9CA3AF" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="220" stroke="#9CA3AF" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="30" y="220" textAnchor="end" fontSize="10" fill="#6B7280">
                  0h
                </text>
                <text x="30" y="170" textAnchor="end" fontSize="10" fill="#6B7280">
                  1h
                </text>
                <text x="30" y="120" textAnchor="end" fontSize="10" fill="#6B7280">
                  2h
                </text>
                <text x="30" y="70" textAnchor="end" fontSize="10" fill="#6B7280">
                  3h
                </text>
                <text x="30" y="20" textAnchor="end" fontSize="10" fill="#6B7280">
                  4h
                </text>

                {/* Horizontal grid lines */}
                <line x1="50" y1="170" x2="550" y2="170" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="120" x2="550" y2="120" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="70" x2="550" y2="70" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="20" x2="550" y2="20" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />

                {/* Data points and line */}
                {safeDaily.map((point, index) => {
                  const x = 50 + (index * 500) / 6 + 500 / 12
                  const y = 220 - (point.value || 0) * 50
                  return (
                    <g key={index}>
                      {/* X-axis label */}
                      <text x={x} y="235" textAnchor="middle" fontSize="10" fill="#6B7280">
                        {point.name || ""}
                      </text>

                      {/* Data point */}
                      <circle cx={x} cy={y} r="4" fill="#6366F1" />

                      {/* Value label */}
                      <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#6B7280">
                        {(point.value || 0) > 0 ? `${point.value || 0}h` : "-"}
                      </text>

                      {/* Connect to next point with line */}
                      {index < safeDaily.length - 1 && safeDaily[index + 1] && (
                        <line
                          x1={x}
                          y1={y}
                          x2={50 + ((index + 1) * 500) / 6 + 500 / 12}
                          y2={220 - (safeDaily[index + 1].value || 0) * 50}
                          stroke="#6366F1"
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  )
                })}

                {/* Area under the line */}
                <path
                  d={`
                    M${50 + 500 / 12},${220 - (safeDaily[0]?.value || 0) * 50}
                    ${safeDaily
                      .slice(1)
                      .map((point, index) => {
                        const x = 50 + ((index + 1) * 500) / 6 + 500 / 12
                        const y = 220 - (point?.value || 0) * 50
                        return `L${x},${y}`
                      })
                      .join(" ")}
                    L${50 + ((safeDaily.length - 1) * 500) / 6 + 500 / 12},220
                    L${50 + 500 / 12},220
                    Z
                  `}
                  fill="url(#dailyGradient)"
                  opacity="0.3"
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="dailyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="w-full h-full">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Weekly Learning Trends (Last 4 Weeks)</div>
            <div className="h-56">
              {/* Line chart for weekly trends */}
              <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {/* X and Y axes */}
                <line x1="50" y1="220" x2="550" y2="220" stroke="#9CA3AF" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="220" stroke="#9CA3AF" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="30" y="220" textAnchor="end" fontSize="10" fill="#6B7280">
                  0h
                </text>
                <text x="30" y="170" textAnchor="end" fontSize="10" fill="#6B7280">
                  5h
                </text>
                <text x="30" y="120" textAnchor="end" fontSize="10" fill="#6B7280">
                  10h
                </text>
                <text x="30" y="70" textAnchor="end" fontSize="10" fill="#6B7280">
                  15h
                </text>
                <text x="30" y="20" textAnchor="end" fontSize="10" fill="#6B7280">
                  20h
                </text>

                {/* Horizontal grid lines */}
                <line x1="50" y1="170" x2="550" y2="170" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="120" x2="550" y2="120" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="70" x2="550" y2="70" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50" y1="20" x2="550" y2="20" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />

                {/* Data points and line */}
                {safeWeekly.map((point, index) => {
                  const x = 50 + (index * 500) / 3 + 500 / 6
                  const y = 220 - (point.value || 0) * 10
                  return (
                    <g key={index}>
                      {/* X-axis label */}
                      <text x={x} y="235" textAnchor="middle" fontSize="10" fill="#6B7280">
                        {point.name || ""}
                      </text>

                      {/* Data point */}
                      <circle cx={x} cy={y} r="4" fill="#8B5CF6" />

                      {/* Value label */}
                      <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#6B7280">
                        {point.value || 0}h
                      </text>

                      {/* Connect to next point with line */}
                      {index < safeWeekly.length - 1 && safeWeekly[index + 1] && (
                        <line
                          x1={x}
                          y1={y}
                          x2={50 + ((index + 1) * 500) / 3 + 500 / 6}
                          y2={220 - (safeWeekly[index + 1].value || 0) * 10}
                          stroke="#8B5CF6"
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  )
                })}

                {/* Area under the line */}
                <path
                  d={`
                    M${50 + 500 / 6},${220 - (safeWeekly[0]?.value || 0) * 10}
                    ${safeWeekly
                      .slice(1)
                      .map((point, index) => {
                        const x = 50 + ((index + 1) * 500) / 3 + 500 / 6
                        const y = 220 - (point?.value || 0) * 10
                        return `L${x},${y}`
                      })
                      .join(" ")}
                    L${50 + ((safeWeekly.length - 1) * 500) / 3 + 500 / 6},220
                    L${50 + 500 / 6},220
                    Z
                  `}
                  fill="url(#weeklyGradient)"
                  opacity="0.3"
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </TabsContent>

          <TabsContent value="byType" className="w-full h-full">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Time Spent by Goal Type</div>
            <div className="h-56">
              {/* Bar chart for time by type */}
              <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                {/* X and Y axes */}
                <line x1="150" y1="220" x2="550" y2="220" stroke="#9CA3AF" strokeWidth="1" />
                <line x1="150" y1="20" x2="150" y2="220" stroke="#9CA3AF" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="130" y="220" textAnchor="end" fontSize="10" fill="#6B7280">
                  0h
                </text>
                <text x="130" y="170" textAnchor="end" fontSize="10" fill="#6B7280">
                  2h
                </text>
                <text x="130" y="120" textAnchor="end" fontSize="10" fill="#6B7280">
                  4h
                </text>
                <text x="130" y="70" textAnchor="end" fontSize="10" fill="#6B7280">
                  6h
                </text>
                <text x="130" y="20" textAnchor="end" fontSize="10" fill="#6B7280">
                  8h
                </text>

                {/* Horizontal grid lines */}
                <line x1="150" y1="170" x2="550" y2="170" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="150" y1="120" x2="550" y2="120" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="150" y1="70" x2="550" y2="70" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="150" y1="20" x2="550" y2="20" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />

                {/* Data bars */}
                {safeType.map((point, index) => {
                  const barWidth = 50
                  const x = 150 + index * 80 + barWidth / 2
                  const barHeight = (point.value || 0) * 25
                  const y = 220 - barHeight

                  // Generate a color based on index
                  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"]
                  const color = colors[index % colors.length]

                  return (
                    <g key={index}>
                      {/* X-axis label */}
                      <text x={x} y="235" textAnchor="middle" fontSize="10" fill="#6B7280">
                        {point.name || ""}
                      </text>

                      {/* Bar */}
                      <rect x={x - barWidth / 2} y={y} width={barWidth} height={barHeight} fill={color} rx="2" />

                      {/* Value label */}
                      <text x={x} y={y - 5} textAnchor="middle" fontSize="10" fill="#6B7280">
                        {point.value || 0}h
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
