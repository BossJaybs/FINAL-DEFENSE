import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart2, Target, Clock, Calendar, Bell, Award, Share2, Zap, CheckCircle } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Learning Tracker</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/features" className="text-gray-900 font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </nav>
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

      {/* Hero section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Powerful Features to Enhance Your Learning</h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover all the tools and features designed to help you learn more effectively and stay motivated.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[#0f172a] hover:bg-[#1e293b]">
                Start Your Learning Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BarChart2}
              title="Progress Tracking"
              description="Monitor your learning with detailed analytics and visualizations to see how far you've come."
            />
            <FeatureCard
              icon={Target}
              title="Goal Setting"
              description="Set SMART learning goals with deadlines and milestones to keep yourself accountable."
            />
            <FeatureCard
              icon={Clock}
              title="Study Timer"
              description="Track your study sessions with a built-in timer that helps you maintain focus and build consistency."
            />
            <FeatureCard
              icon={Calendar}
              title="Learning Schedule"
              description="Plan your learning sessions with an integrated calendar to maintain a consistent routine."
            />
            <FeatureCard
              icon={Bell}
              title="Smart Reminders"
              description="Get personalized notifications to help you stay on track with your learning goals."
            />
            <FeatureCard
              icon={Award}
              title="Achievements & Streaks"
              description="Earn badges and maintain streaks to stay motivated throughout your learning journey."
            />
            <FeatureCard
              icon={Share2}
              title="Notes & Resources"
              description="Store and organize your learning materials, notes, and resources in one place."
            />
            <FeatureCard
              icon={Zap}
              title="Spaced Repetition"
              description="Optimize your learning with scientifically-proven spaced repetition techniques."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Progress Reports"
              description="Receive weekly and monthly reports summarizing your learning progress and achievements."
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-[#0f172a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners who have improved their study habits and achieved their goals with Learning
              Tracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-[#0f172a] hover:bg-gray-100">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
