"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <BookOpen className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Learning Tracker</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/goals"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/goals") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Goals
        </Link>
        <Link
          href="/progress"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/progress") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Progress
        </Link>
        <Link
          href="/resources"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/resources") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Resources
        </Link>
      </nav>
    </div>
  )
}
