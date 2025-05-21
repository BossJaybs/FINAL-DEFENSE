import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-end mb-4">
            <UserNav />
          </div>
          <main className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
