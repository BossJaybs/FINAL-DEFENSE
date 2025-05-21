"use server"

import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase"

// Function to get all users
export async function getUsers() {
  try {
    // For demo mode or when Supabase is not configured
    if (!isSupabaseConfigured()) {
      return {
        users: [
          {
            id: "1",
            user_id: "1",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "2",
            first_name: "Jane",
            last_name: "Smith",
            email: "jane@example.com",
            created_at: new Date().toISOString(),
          },
        ],
        error: null,
      }
    }

    const { data, error } = await supabase.from("profiles").select("*")

    if (error) {
      console.error("Error getting users:", error)
      return { users: [], error }
    }

    return { users: data || [], error: null }
  } catch (error) {
    console.error("Error in getUsers:", error)
    return { users: [], error }
  }
}

// Function to get user progress
export async function getUserProgress() {
  try {
    // For demo mode or when Supabase is not configured
    if (!isSupabaseConfigured()) {
      return {
        progress: [
          {
            id: "1",
            user_id: "1",
            material_id: "1",
            progress: 75,
            completed: false,
            started_at: new Date().toISOString(),
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
              first_name: "John",
              last_name: "Doe",
              email: "john@example.com",
            },
            learning_materials: {
              title: "Introduction to JavaScript",
              description: "Learn the basics of JavaScript programming",
              category: "Programming",
              difficulty: "beginner",
            },
          },
          {
            id: "2",
            user_id: "2",
            material_id: "2",
            progress: 100,
            completed: true,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane@example.com",
            },
            learning_materials: {
              title: "CSS Grid Layout",
              description: "Learn how to create responsive layouts with CSS Grid",
              category: "Web Design",
              difficulty: "intermediate",
            },
          },
        ],
        error: null,
      }
    }

    // Check if user_progress table exists
    const { error: tableCheckError } = await supabase.from("user_progress").select("id").limit(1)

    if (tableCheckError) {
      console.error("Error checking user_progress table:", tableCheckError)
      return { progress: [], error: tableCheckError }
    }

    // Get all progress records
    const { data: progressData, error: progressError } = await supabase.from("user_progress").select("*")

    if (progressError) {
      console.error("Error getting user progress:", progressError)
      return { progress: [], error: progressError }
    }

    // If no progress data, return empty array
    if (!progressData || progressData.length === 0) {
      return { progress: [], error: null }
    }

    // Get all user IDs from progress data
    const userIds = [...new Set(progressData.map((item) => item.user_id))]

    // Get all material IDs from progress data
    const materialIds = [...new Set(progressData.map((item) => item.material_id))]

    // Get user profiles for these IDs
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", userIds)

    if (profilesError) {
      console.error("Error getting user profiles:", profilesError)
      // Continue without profiles
    }

    // Get learning materials for these IDs
    const { data: materialsData, error: materialsError } = await supabase
      .from("learning_materials")
      .select("*")
      .in("id", materialIds)

    if (materialsError) {
      console.error("Error getting learning materials:", materialsError)
      // Continue without materials
    }

    // Create a map of user_id to profile data
    const profilesMap = (profilesData || []).reduce((map, profile) => {
      map[profile.user_id] = profile
      return map
    }, {})

    // Create a map of material_id to material data
    const materialsMap = (materialsData || []).reduce((map, material) => {
      map[material.id] = material
      return map
    }, {})

    // Combine the data
    const combinedProgress = progressData.map((progress) => ({
      ...progress,
      profiles: profilesMap[progress.user_id] || null,
      learning_materials: materialsMap[progress.material_id] || null,
    }))

    return { progress: combinedProgress, error: null }
  } catch (error) {
    console.error("Error in getUserProgress:", error)
    return { progress: [], error }
  }
}

// Function to get learning materials
export async function getLearningMaterials() {
  try {
    // For demo mode or when Supabase is not configured
    if (!isSupabaseConfigured()) {
      return {
        materials: [
          {
            id: "1",
            title: "Introduction to JavaScript",
            description: "Learn the basics of JavaScript programming",
            content: "JavaScript is a programming language that enables interactive web pages...",
            category: "Programming",
            difficulty: "beginner",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "CSS Grid Layout",
            description: "Learn how to create responsive layouts with CSS Grid",
            content: "CSS Grid Layout is a two-dimensional layout system for the web...",
            category: "Web Design",
            difficulty: "intermediate",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Advanced React Patterns",
            description: "Master advanced React design patterns",
            content: "In this course, we will explore advanced React patterns like render props...",
            category: "Web Development",
            difficulty: "advanced",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      }
    }

    const { data, error } = await supabase.from("learning_materials").select("*")

    if (error) {
      console.error("Error getting learning materials:", error)
      return { materials: [], error }
    }

    return { materials: data || [], error: null }
  } catch (error) {
    console.error("Error in getLearningMaterials:", error)
    return { materials: [], error }
  }
}

// Function to create a learning material
export async function createLearningMaterial(material: {
  title: string
  description: string
  content: string
  category: string
  difficulty: string
}) {
  try {
    const { data: authUser } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("learning_materials")
      .insert([
        {
          ...material,
          created_by: authUser.user?.id,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating learning material:", error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in createLearningMaterial:", error)
    return { success: false, data: null, error }
  }
}

// Function to update a learning material
export async function updateLearningMaterial(
  id: string,
  material: {
    title: string
    description?: string
    content?: string
    category: string
    difficulty: string
  },
) {
  try {
    const { data, error } = await supabase
      .from("learning_materials")
      .update({
        title: material.title,
        description: material.description,
        content: material.content,
        category: material.category,
        difficulty: material.difficulty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating learning material:", error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in updateLearningMaterial:", error)
    return { success: false, data: null, error }
  }
}

// Function to update user progress
export async function updateUserProgress(
  id: string,
  progress: {
    progress: number
    completed: boolean
  },
) {
  try {
    const updateData: any = {
      progress: progress.progress,
      completed: progress.completed,
      updated_at: new Date().toISOString(),
    }

    // If completed is true, set completed_at
    if (progress.completed) {
      updateData.completed_at = new Date().toISOString()
    } else {
      updateData.completed_at = null
    }

    const { data, error } = await supabase.from("user_progress").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Error updating user progress:", error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error("Error in updateUserProgress:", error)
    return { success: false, data: null, error }
  }
}

// Function to delete a learning material
export async function deleteLearningMaterial(id: string) {
  try {
    const { error } = await supabase.from("learning_materials").delete().eq("id", id)

    if (error) {
      console.error("Error deleting learning material:", error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteLearningMaterial:", error)
    return { success: false, error }
  }
}

// Function to delete a user
export async function deleteUser(userId: string) {
  try {
    // Delete the user's profile
    const { error: profileError } = await supabase.from("profiles").delete().eq("user_id", userId)

    if (profileError) {
      console.error("Error deleting user profile:", profileError)
      return { success: false, error: profileError }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return { success: false, error }
  }
}

// Function to check if user is admin
export async function isUserAdmin(): Promise<boolean> {
  try {
    // Check if admin session cookie exists
    const adminSession = cookies().get("admin_session")
    if (adminSession) {
      return true
    }

    // If no admin session, check if the user is in the admin_users table
    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser.user) {
      return false
    }

    const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", authUser.user.id).single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error in isUserAdmin:", error)
    return false
  }
}

// Function to log in as admin
export async function loginAsAdmin() {
  // Set a cookie to indicate admin status
  cookies().set("isAdmin", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })

  // Redirect to admin dashboard
  redirect("/admin")
}

export async function checkAdminStatus() {
  // If Supabase is not configured, check localStorage on the client side
  if (!isSupabaseConfigured()) {
    return { isAdmin: true } // For demo purposes
  }

  const isAdmin = cookies().get("isAdmin")?.value === "true"
  return { isAdmin }
}

export async function logoutAdmin() {
  cookies().delete("isAdmin")
  redirect("/login")
}
