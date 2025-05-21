"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Clock, BookOpen, Award } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { useAppContext } from "@/context/app-context"
import { useLanguage } from "@/context/language-context"

// Define the types for our progress metrics
interface ProgressMetrics {
  totalHours: number
  totalHoursChange: number
  topicsCovered: number
  topicsCoveredChange: number
  currentStreak: number
  bestStreak: number
  avgDailyTime: number
  avgDailyTimeChange: number
}

// Define the type for our activity data
interface DailyActivity {
  day: string
  hours: number
}

export default function ProgressPage() {
  const [timeframe, setTimeframe] = useState("week")
  const { activities, goals } = useAppContext()
  const { t } = useLanguage()
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    totalHours: 0,
    totalHoursChange: 0,
    topicsCovered: 0,
    topicsCoveredChange: 0,
    currentStreak: 0,
    bestStreak: 0,
    avgDailyTime: 0,
    avgDailyTimeChange: 0,
  })
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Calculate metrics based on activities and timeframe
  useEffect(() => {
    setIsLoading(true)

    // Calculate the date range based on the selected timeframe
    const now = new Date()
    let startDate = new Date()

    switch (timeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        startDate = new Date(0) // Beginning of time
        break
    }

    // Previous period for comparison
    const previousPeriodStart = new Date(startDate)
    const previousPeriodEnd = new Date(startDate)

    switch (timeframe) {
      case "week":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7)
        break
      case "month":
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1)
        break
      case "year":
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1)
        break
    }

    // Filter activities within the selected timeframe
    const currentActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return activityDate >= startDate && activityDate <= now
    })

    // Filter activities from the previous period
    const previousActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return activityDate >= previousPeriodStart && activityDate < startDate
    })

    // Calculate total hours
    const calculateTotalHours = (acts: typeof activities) => {
      return acts.reduce((total, activity) => {
        // Extract hours from duration strings like "30 minutes", "1.5 hours", etc.
        const durationMatch = activity.duration.match(/(\d+(\.\d+)?)/)
        if (durationMatch) {
          const value = Number.parseFloat(durationMatch[1])
          if (activity.duration.includes("hour")) {
            return total + value
          } else if (activity.duration.includes("minute")) {
            return total + value / 60
          }
        }
        return total
      }, 0)
    }

    const currentTotalHours = calculateTotalHours(currentActivities)
    const previousTotalHours = calculateTotalHours(previousActivities)
    const totalHoursChange = currentTotalHours - previousTotalHours

    // Calculate topics covered (unique goals worked on)
    const currentTopics = new Set(currentActivities.map((a) => a.goalId).filter(Boolean)).size
    const previousTopics = new Set(previousActivities.map((a) => a.goalId).filter(Boolean)).size
    const topicsCoveredChange = currentTopics - previousTopics

    // Calculate streak
    const calculateStreak = () => {
      // Sort activities by date in descending order
      const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (sortedActivities.length === 0) return { current: 0, best: 0 }

      let currentStreak = 0
      let bestStreak = 0
      let tempStreak = 0
      let lastDate: Date | null = null

      // Group activities by day
      const activityDays = new Set<string>()
      sortedActivities.forEach((activity) => {
        const date = new Date(activity.date)
        const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        activityDays.add(dateString)
      })

      // Convert to array and sort
      const sortedDays = Array.from(activityDays).sort().reverse()

      // Calculate current streak
      const today = new Date()
      const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      const yesterdayDate = new Date(today)
      yesterdayDate.setDate(today.getDate() - 1)
      const yesterdayString = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth()}-${yesterdayDate.getDate()}`

      // Check if there's an activity today or yesterday to start the streak
      if (sortedDays[0] === todayString || sortedDays[0] === yesterdayString) {
        currentStreak = 1
        const checkDate = new Date(sortedDays[0])

        for (let i = 1; i < sortedDays.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1)
          const checkDateString = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`

          if (sortedDays[i] === checkDateString) {
            currentStreak++
          } else {
            break
          }
        }
      }

      // Calculate best streak
      for (let i = 0; i < sortedDays.length; i++) {
        const currentDate = new Date(sortedDays[i])

        if (lastDate === null) {
          tempStreak = 1
          lastDate = currentDate
          continue
        }

        const dayDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff === 1) {
          tempStreak++
        } else {
          tempStreak = 1
        }

        bestStreak = Math.max(bestStreak, tempStreak)
        lastDate = currentDate
      }

      return { current: currentStreak, best: Math.max(currentStreak, bestStreak) }
    }

    const streakData = calculateStreak()

    // Calculate average daily time
    const calculateAvgDailyTime = (acts: typeof activities, days: number) => {
      const totalHours = calculateTotalHours(acts)
      return days > 0 ? totalHours / days : 0
    }

    const daysDiff = (date1: Date, date2: Date) => {
      return Math.max(1, Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)))
    }

    const currentDays = daysDiff(startDate, now)
    const previousDays = daysDiff(previousPeriodStart, startDate)

    const currentAvgDaily = calculateAvgDailyTime(currentActivities, currentDays)
    const previousAvgDaily = calculateAvgDailyTime(previousActivities, previousDays)
    const avgDailyTimeChange = currentAvgDaily - previousAvgDaily

    // Calculate daily activity for chart
    const getDailyActivityData = () => {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const result: DailyActivity[] = []

      // If timeframe is week, show the last 7 days
      if (timeframe === "week") {
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayIndex = date.getDay()
          const dayName = dayNames[dayIndex]

          const dayActivities = activities.filter((activity) => {
            const activityDate = new Date(activity.date)
            return (
              activityDate.getDate() === date.getDate() &&
              activityDate.getMonth() === date.getMonth() &&
              activityDate.getFullYear() === date.getFullYear()
            )
          })

          const hours = calculateTotalHours(dayActivities)
          result.push({ day: dayName, hours })
        }
      } else {
        // For other timeframes, aggregate by day of week
        const dayTotals = [0, 0, 0, 0, 0, 0, 0] // Sun, Mon, Tue, Wed, Thu, Fri, Sat
        const dayCounts = [0, 0, 0, 0, 0, 0, 0]

        currentActivities.forEach((activity) => {
          const activityDate = new Date(activity.date)
          const dayIndex = activityDate.getDay()

          const durationMatch = activity.duration.match(/(\d+(\.\d+)?)/)
          if (durationMatch) {
            const value = Number.parseFloat(durationMatch[1])
            if (activity.duration.includes("hour")) {
              dayTotals[dayIndex] += value
            } else if (activity.duration.includes("minute")) {
              dayTotals[dayIndex] += value / 60
            }
            dayCounts[dayIndex]++
          }
        })

        for (let i = 0; i < 7; i++) {
          result.push({
            day: dayNames[i],
            hours: dayCounts[i] > 0 ? dayTotals[i] / dayCounts[i] : 0,
          })
        }
      }

      return result
    }

    // Update state with calculated metrics
    setMetrics({
      totalHours: Number.parseFloat(currentTotalHours.toFixed(1)),
      totalHoursChange: Number.parseFloat(totalHoursChange.toFixed(1)),
      topicsCovered: currentTopics,
      topicsCoveredChange: topicsCoveredChange,
      currentStreak: streakData.current,
      bestStreak: streakData.best,
      avgDailyTime: Number.parseFloat(currentAvgDaily.toFixed(1)),
      avgDailyTimeChange: Number.parseFloat(avgDailyTimeChange.toFixed(1)),
    })

    setDailyActivity(getDailyActivityData())
    setIsLoading(false)
  }, [timeframe, activities])

  // Format change value for display
  const formatChange = (value: number) => {
    if (value === 0) return "No change"
    return value > 0 ? `+${value}` : `${value}`
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t.progress.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.progress.subtitle}</p>
      </div>

      {/* Time period selector */}
      <div className="mb-6 flex items-center space-x-2">
        <span className="text-sm font-medium">{t.progress.view}:</span>
        <div className="flex bg-white rounded-md border p-1 dark:bg-gray-800 dark:border-gray-700">
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "week" ? "bg-gray-100 font-medium dark:bg-gray-700" : "text-gray-600 dark:text-gray-400"}`}
            onClick={() => setTimeframe("week")}
          >
            {t.progress.week}
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "month" ? "bg-gray-100 font-medium dark:bg-gray-700" : "text-gray-600 dark:text-gray-400"}`}
            onClick={() => setTimeframe("month")}
          >
            {t.progress.month}
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "year" ? "bg-gray-100 font-medium dark:bg-gray-700" : "text-gray-600 dark:text-gray-400"}`}
            onClick={() => setTimeframe("year")}
          >
            {t.progress.year}
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "all" ? "bg-gray-100 font-medium dark:bg-gray-700" : "text-gray-600 dark:text-gray-400"}`}
            onClick={() => setTimeframe("all")}
          >
            {t.progress.allTime}
          </button>
        </div>
      </div>

      {/* Progress overview cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 flex flex-col h-24">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">{t.progress.totalHours}</span>
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.totalHours}</div>
              <div
                className={`text-xs ${metrics.totalHoursChange > 0 ? "text-green-600" : metrics.totalHoursChange < 0 ? "text-red-600" : "text-gray-500"} mt-1`}
              >
                {formatChange(metrics.totalHoursChange)} {t.progress.from} {timeframe}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">{t.progress.topicsCovered}</span>
                <BookOpen className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.topicsCovered}</div>
              <div
                className={`text-xs ${metrics.topicsCoveredChange > 0 ? "text-green-600" : metrics.topicsCoveredChange < 0 ? "text-red-600" : "text-gray-500"} mt-1`}
              >
                {formatChange(metrics.topicsCoveredChange)} {t.progress.from} {timeframe}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">{t.progress.currentStreak}</span>
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">
                {metrics.currentStreak} {t.dashboard.days}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t.progress.best}: {metrics.bestStreak} {t.dashboard.days}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-500">{t.progress.avgDailyTime}</span>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{metrics.avgDailyTime} hrs</div>
              <div
                className={`text-xs ${metrics.avgDailyTimeChange > 0 ? "text-green-600" : metrics.avgDailyTimeChange < 0 ? "text-red-600" : "text-gray-500"} mt-1`}
              >
                {formatChange(metrics.avgDailyTimeChange)} {t.progress.from} {timeframe}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              {t.progress.learningActivity}
            </CardTitle>
            <CardDescription>{t.progress.hoursPerDay}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? (
                <div className="h-56 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-56 flex items-end justify-between">
                  {dailyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-sm"
                        style={{ height: `${(day.hours / 4) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2 dark:text-gray-300">{day.day}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {day.hours > 0 ? `${day.hours.toFixed(1)}h` : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
