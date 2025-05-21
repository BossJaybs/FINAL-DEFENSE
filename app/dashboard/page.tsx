"use client"

import { useEffect, useState } from "react"
import { ProgressCard } from "@/components/progress-card"
import { LearningGoals } from "@/components/learning-goals"
import { ProgressCharts } from "@/components/progress-charts"
import { useLanguage } from "@/context/language-context"
import { useAppContext } from "@/context/app-context"

export default function Dashboard() {
  const { t } = useLanguage()
  const { activities, goals } = useAppContext()
  const [userName, setUserName] = useState({
    firstName: "John",
    lastName: "Doe",
  })
  const [metrics, setMetrics] = useState({
    currentStreak: 0,
    weeklyLearning: 0,
    goalCompletion: 0,
    streakChange: "+0 days",
    learningChange: "+0 hours",
    completionRemaining: "0%",
  })

  // Calculate metrics based on activities and goals
  useEffect(() => {
    // Calculate current streak
    const calculateStreak = () => {
      if (activities.length === 0) return { streak: 0, change: "+0 days" }

      // Sort activities by date (newest first)
      const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Get today and yesterday dates for comparison
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // Check if there's activity today
      const hasActivityToday = sortedActivities.some((activity) => {
        const activityDate = new Date(activity.date)
        activityDate.setHours(0, 0, 0, 0)
        return activityDate.getTime() === today.getTime()
      })

      // If no activity today, check if there was one yesterday to maintain streak
      const hasActivityYesterday = sortedActivities.some((activity) => {
        const activityDate = new Date(activity.date)
        activityDate.setHours(0, 0, 0, 0)
        return activityDate.getTime() === yesterday.getTime()
      })

      // Start counting streak
      let streak = hasActivityToday ? 1 : 0

      // If no activity today but had yesterday, we'll count from yesterday
      const startIndex = hasActivityToday ? 1 : 0

      if (!hasActivityToday && hasActivityYesterday) {
        streak = 1
      }

      // Get all dates with activities
      const activityDates = sortedActivities.map((activity) => {
        const date = new Date(activity.date)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })

      // Remove duplicates
      const uniqueDates = [...new Set(activityDates)]

      // Sort dates in descending order
      uniqueDates.sort((a, b) => b - a)

      // Count consecutive days
      for (let i = startIndex; i < uniqueDates.length - 1; i++) {
        const currentDate = new Date(uniqueDates[i])
        const nextDate = new Date(uniqueDates[i + 1])

        // Check if dates are consecutive
        const diffTime = currentDate.getTime() - nextDate.getTime()
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
          streak++
        } else {
          break
        }
      }

      // Calculate streak change (compare to last week)
      // For demo purposes, we'll just show a positive change
      const change = streak > 0 ? `+${Math.min(2, streak - 1)} days` : "+0 days"

      return { streak, change }
    }

    // Calculate weekly learning hours
    const calculateWeeklyLearning = () => {
      if (activities.length === 0) return { hours: 0, change: "+0 hours" }

      // Get start of current week
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay()) // Start from Sunday
      startOfWeek.setHours(0, 0, 0, 0)

      // Filter activities from current week
      const thisWeekActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.date)
        return activityDate >= startOfWeek
      })

      // Calculate total hours
      let totalMinutes = 0

      thisWeekActivities.forEach((activity) => {
        // Parse duration (e.g., "30 minutes", "1 hour", "1.5 hours")
        const durationStr = activity.duration.toLowerCase()

        if (durationStr.includes("hour")) {
          const hours = Number.parseFloat(durationStr.split(" ")[0])
          totalMinutes += hours * 60
        } else if (durationStr.includes("minute")) {
          const minutes = Number.parseInt(durationStr.split(" ")[0])
          totalMinutes += minutes
        }
      })

      const hours = Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal place

      // For demo purposes, we'll show a positive change
      const change = hours > 0 ? `+${Math.min(1.5, hours / 3).toFixed(1)} hours` : "+0 hours"

      return { hours, change }
    }

    // Calculate goal completion percentage
    const calculateGoalCompletion = () => {
      if (goals.length === 0) return { percentage: 0, remaining: "0%" }

      // Count completed goals
      const completedGoals = goals.filter((goal) => goal.status === "completed")
      const completionPercentage = Math.round((completedGoals.length / goals.length) * 100)

      // Calculate remaining percentage to reach target (assuming target is 100%)
      const remaining = `${100 - completionPercentage}% to reach your target`

      return { percentage: completionPercentage, remaining }
    }

    // Calculate all metrics
    const { streak, change: streakChange } = calculateStreak()
    const { hours, change: learningChange } = calculateWeeklyLearning()
    const { percentage, remaining } = calculateGoalCompletion()

    setMetrics({
      currentStreak: streak,
      weeklyLearning: hours,
      goalCompletion: percentage,
      streakChange,
      learningChange,
      completionRemaining: remaining,
    })
  }, [activities, goals])

  useEffect(() => {
    // Load user name from localStorage
    const savedFirstName = localStorage.getItem("firstName")
    const savedLastName = localStorage.getItem("lastName")

    if (savedFirstName && savedLastName) {
      setUserName({
        firstName: savedFirstName,
        lastName: savedLastName,
      })
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedFirstName = localStorage.getItem("firstName")
      const updatedLastName = localStorage.getItem("lastName")

      if (updatedFirstName && updatedLastName) {
        setUserName({
          firstName: updatedFirstName,
          lastName: updatedLastName,
        })
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
        <h1 className="text-2xl font-bold">
          {t.dashboard.welcomeBack}, {userName.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t.dashboard.keepUp}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ProgressCard
          title={t.dashboard.currentStreak}
          value={metrics.currentStreak.toString()}
          unit={t.dashboard.days}
          change={metrics.streakChange}
          icon="trophy"
        />
        <ProgressCard
          title={t.dashboard.weeklyLearning}
          value={metrics.weeklyLearning.toString()}
          unit={t.dashboard.hours}
          change={metrics.learningChange}
          icon="clock"
        />
        <ProgressCard
          title={t.dashboard.goalCompletion}
          value={metrics.goalCompletion.toString()}
          unit="%"
          change={metrics.completionRemaining}
          icon="target"
          showProgress={true}
          progress={metrics.goalCompletion}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressCharts />
        </div>
        <div>
          <LearningGoals />
        </div>
      </div>
    </div>
  )
}
