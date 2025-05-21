import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h1 className="text-xl font-bold text-white">Learning Habit Tracker</h1>
          </div>
        </div>

        <p className="text-gray-200 text-lg">
          Track your learning progress, set goals, and
          <br />
          improve your study habits
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full bg-white text-indigo-900 hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
              Sign in
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full border-white text-black bg-white hover:bg-transparent hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Create account
            </Button>
          </Link>
        </div>

        {/* Optional: Add a subtle gradient overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
