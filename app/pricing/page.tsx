import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle } from "lucide-react"

export default function PricingPage() {
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
            <Link href="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-900 font-medium">
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

      {/* Pricing section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your learning needs. No hidden fees or commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Free</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for casual learners</p>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="border-t px-6 py-4">
                <ul className="space-y-3">
                  <PricingFeature>Basic progress tracking</PricingFeature>
                  <PricingFeature>Up to 3 learning goals</PricingFeature>
                  <PricingFeature>7-day activity history</PricingFeature>
                  <PricingFeature>Basic analytics</PricingFeature>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border rounded-lg overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Premium</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For dedicated learners</p>
                <Link href="/register">
                  <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b]">Get Started</Button>
                </Link>
              </div>
              <div className="border-t px-6 py-4 bg-gray-50">
                <ul className="space-y-3">
                  <PricingFeature>Advanced progress tracking</PricingFeature>
                  <PricingFeature>Unlimited learning goals</PricingFeature>
                  <PricingFeature>Full activity history</PricingFeature>
                  <PricingFeature>Detailed analytics</PricingFeature>
                  <PricingFeature>Study timer & reminders</PricingFeature>
                  <PricingFeature>Weekly progress reports</PricingFeature>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Pro</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For professional learners</p>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="border-t px-6 py-4">
                <ul className="space-y-3">
                  <PricingFeature>Everything in Premium</PricingFeature>
                  <PricingFeature>AI learning recommendations</PricingFeature>
                  <PricingFeature>Advanced spaced repetition</PricingFeature>
                  <PricingFeature>Learning path creation</PricingFeature>
                  <PricingFeature>Priority support</PricingFeature>
                  <PricingFeature>API access</PricingFeature>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Can I switch plans later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your
                  next billing cycle.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Is there a free trial for paid plans?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 14-day free trial for both Premium and Pro plans. No credit card required to start
                  your trial.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to your paid
                  features until the end of your current billing period.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Do you offer discounts for students or educators?</h3>
                <p className="text-gray-600">
                  Yes, we offer special pricing for students, educators, and educational institutions. Contact our
                  support team for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-[#0f172a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Learning Journey Today</h2>
            <p className="text-xl mb-8">
              Join thousands of learners who have improved their study habits and achieved their goals with Learning
              Tracker.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#0f172a] hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <span className="text-gray-600">{children}</span>
    </li>
  )
}
