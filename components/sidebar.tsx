"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { BookOpen, LayoutGrid, BarChart2, Clock, Settings, LogOut, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const { t } = useLanguage()

  const handleMouseEnter = () => setExpanded(true)
  const handleMouseLeave = () => setExpanded(false)

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/cookies here
    router.push("/register")
  }

  return (
    <div
      className={cn(
        "h-screen bg-[#121212] text-white transition-all duration-300 flex flex-col",
        expanded ? "w-64" : "w-16",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!expanded && (
        <div className="absolute top-4 left-16 bg-white text-black p-2 rounded shadow-lg text-xs w-48 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="font-medium">Hover on the left side to expand the sidebar</p>
          <p className="text-gray-600 mt-1">The sidebar will expand when you hover over it, showing the full labels.</p>
        </div>
      )}

      <div className="p-4">
        {expanded ? (
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold">Learning Habit Tracker</span>
          </div>
        ) : (
          <BookOpen className="h-6 w-6 mx-auto" />
        )}
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          <SidebarItem
            href="/dashboard"
            icon={LayoutGrid}
            label={t.nav.dashboard}
            expanded={expanded}
            active={pathname === "/dashboard"}
          />
          <SidebarItem
            href="/progress"
            icon={BarChart2}
            label={t.nav.progress}
            expanded={expanded}
            active={pathname === "/progress"}
          />
          <SidebarItem
            href="/goals"
            icon={Target}
            label={t.nav.goals}
            expanded={expanded}
            active={pathname === "/goals"}
          />
          <SidebarItem
            href="/activity"
            icon={Clock}
            label={t.nav.activity}
            expanded={expanded}
            active={pathname === "/activity"}
          />
        </ul>
      </nav>

      <div className="p-4 space-y-2">
        <li className="list-none">
          <Link
            href="/settings"
            className={cn(
              "flex items-center py-2 px-4 rounded-md hover:bg-white/10 transition-colors",
              !expanded && "justify-center",
              pathname === "/settings" && "bg-white/10",
            )}
          >
            <Settings className="h-5 w-5" />
            {expanded && <span className="ml-3">{t.nav.settings}</span>}
          </Link>
        </li>
        <li className="list-none">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center py-2 px-4 rounded-md hover:bg-white/10 transition-colors w-full",
              !expanded && "justify-center",
            )}
          >
            <LogOut className="h-5 w-5" />
            {expanded && <span className="ml-3">{t.nav.logout}</span>}
          </button>
        </li>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  label: string
  expanded: boolean
  active?: boolean
}

function SidebarItem({ href, icon: Icon, label, expanded, active }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center py-2 px-4 rounded-md hover:bg-white/10 transition-colors",
          !expanded && "justify-center",
          active && "bg-white/10",
        )}
      >
        <Icon className="h-5 w-5" />
        {expanded && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  )
}
