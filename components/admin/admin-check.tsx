"use client"

import type React from "react"

import { useAdmin } from "@/context/admin-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking admin status...</span>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
