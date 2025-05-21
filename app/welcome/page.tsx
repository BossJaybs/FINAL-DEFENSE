"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, BarChart2, Target, Clock, CheckCircle } from "lucide-react"

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 3

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Learning Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#0f172a] hover:bg-[#1e293b]">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Onboarding Steps */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`h-1 w-16 sm:w-24 md:w-32 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">Welcome</span>
              <span className="text-sm text-gray-600">Set Goals</span>
              <span className="text-sm text-gray-600">Get Started</span>
            </div>
          </div>

          {/* Step content */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            {currentStep === 0 && (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Learning Tracker</h1>
                <p className="text-gray-600 mb-8">
                  Your personal learning companion to help you track progress, set goals, and improve your study habits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 border rounded-lg">
                    <BarChart2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Track Progress</h3>
                    <p className="text-sm text-gray-500">Monitor your learning journey with detailed analytics</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Set Goals</h3>
                    <p className="text-sm text-gray-500">Define clear objectives and track your completion</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Build Habits</h3>
                    <p className="text-sm text-gray-500">Develop consistent study routines and streaks</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h1 className="text-3xl font-bold mb-4 text-center">Set Your Learning Goals</h1>
                <p className="text-gray-600 mb-8 text-center">What would you like to achieve with Learning Tracker?</p>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Learn a new skill</h3>
                    <p className="text-sm text-gray-500">Track your progress as you master a new ability</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Complete a course</h3>
                    <p className="text-sm text-gray-500">Stay on track with your online learning</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Prepare for certification</h3>
                    <p className="text-sm text-gray-500">Organize your study plan for an upcoming exam</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                    <h3 className="font-medium">Build a portfolio</h3>
                    <p className="text-sm text-gray-500">Track projects and showcase your work</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">You're All Set!</h1>
                <p className="text-gray-600 mb-8">Create your account to start tracking your learning journey.</p>
                <div className="mb-8">
                  <img src="/placeholder.svg?height=200&width=200" alt="Success illustration" className="mx-auto" />
                </div>
                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <Link href="/register">
                    <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b]">Create Account</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Already have an account? Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                Back
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button className="bg-[#0f172a] hover:bg-[#1e293b]" onClick={nextStep}>
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Link href="/register">
                  <Button className="bg-[#0f172a] hover:bg-[#1e293b]">
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
