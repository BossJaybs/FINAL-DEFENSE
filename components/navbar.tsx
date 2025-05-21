import Link from "next/link"

export function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 mr-6">
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
            className="text-black"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="font-bold">Learning Tracker</span>
        </div>

        <nav className="flex-1">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/progress" className="text-sm font-medium hover:text-primary">
                Progress
              </Link>
            </li>
            <li>
              <Link href="/goals" className="text-sm font-medium hover:text-primary">
                Goals
              </Link>
            </li>
            <li>
              <Link href="/activity" className="text-sm font-medium hover:text-primary">
                Activities
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="text-sm font-medium hover:text-primary">
                Analytics
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto">
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
