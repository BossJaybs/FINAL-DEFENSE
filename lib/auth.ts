import { supabase, isSupabaseConfigured } from "./supabase"

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    // For demo purposes, return a mock user
    return {
      user: {
        id: "demo-user-id",
        email,
        user_metadata: {
          first_name: "Demo",
          last_name: "User",
        },
      },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error("Error signing in:", error)
    return { user: null, error }
  }
}

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  if (!isSupabaseConfigured()) {
    // For demo purposes, return a mock user
    return {
      user: {
        id: "demo-user-id",
        email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      throw error
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error("Error signing up:", error)
    return { user: null, error }
  }
}

export async function signOut() {
  // Clear all localStorage items related to user session
  localStorage.removeItem("firstName")
  localStorage.removeItem("lastName")
  localStorage.removeItem("isAdmin")
  localStorage.removeItem("profileImage")
  localStorage.removeItem("supabase.auth.token")

  // Clear any other app state that might be stored
  sessionStorage.clear()

  // If Supabase is configured, sign out from there too
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out from Supabase:", error)
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Force a page reload to clear any in-memory state
  window.location.href = "/login"

  return { error: null }
}

export async function getUser() {
  if (!isSupabaseConfigured()) {
    // For demo purposes, check localStorage
    const firstName = localStorage.getItem("firstName")
    if (firstName) {
      return {
        user: {
          id: "demo-user-id",
          email: "demo@example.com",
          user_metadata: {
            first_name: firstName,
            last_name: localStorage.getItem("lastName") || "",
          },
        },
        error: null,
      }
    }
    return { user: null, error: null }
  }

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error("Error getting user:", error)
    return { user: null, error }
  }
}
