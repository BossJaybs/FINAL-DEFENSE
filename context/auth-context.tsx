"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip Supabase auth if not configured
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return () => {}
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)

      // Update localStorage for compatibility with existing code
      if (session?.user) {
        localStorage.setItem("firstName", session.user.user_metadata?.first_name || "User")
        localStorage.setItem("lastName", session.user.user_metadata?.last_name || "")
        window.dispatchEvent(new Event("storage"))
      } else if (event === "SIGNED_OUT") {
        // Clear localStorage on sign out
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        localStorage.removeItem("isAdmin")
        localStorage.removeItem("profileImage")
        window.dispatchEvent(new Event("storage"))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}
