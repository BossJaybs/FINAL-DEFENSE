"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type AdminContextType = {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
})

export const useAdmin = () => useContext(AdminContext)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Check localStorage for admin status
      const checkAdminStatus = () => {
        const adminStatus = localStorage.getItem("isAdmin") === "true"
        setIsAdmin(adminStatus)
        setIsLoading(false)
      }

      // Initial check
      checkAdminStatus()

      // Listen for changes
      window.addEventListener("storage", checkAdminStatus)

      return () => {
        window.removeEventListener("storage", checkAdminStatus)
      }
    } else {
      // We're on the server, so we can't check localStorage
      setIsLoading(false)
    }
  }, [])

  return <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>{!isLoading && children}</AdminContext.Provider>
}
