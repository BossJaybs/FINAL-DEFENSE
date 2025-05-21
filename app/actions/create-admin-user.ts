"use server"

import { supabase, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase"

export async function createAdminUser() {
  // If Supabase is not configured, return success for demo purposes
  if (!isSupabaseConfigured()) {
    return { success: true, user: { id: "demo-admin-id", email: "admin@example.com" }, error: null }
  }

  try {
    // Check if admin user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: "admin@example.com",
      password: "admin123",
    })

    // If admin exists and login successful, return success
    if (existingUser?.user) {
      return { success: true, user: existingUser.user, error: null }
    }

    // If error is not "Invalid login credentials", something else went wrong
    if (checkError && checkError.message !== "Invalid login credentials") {
      console.error("Error checking for existing admin:", checkError)
      return { success: false, user: null, error: checkError }
    }

    // Admin doesn't exist, create it
    // Note: This requires the service role key which might not be available in all environments
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: "admin@example.com",
        password: "admin123",
        email_confirm: true,
        user_metadata: {
          first_name: "Admin",
          last_name: "User",
          is_admin: true,
        },
      })

      if (error) {
        throw error
      }

      // Create profile for admin
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        user_id: data.user.id,
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
      })

      if (profileError) {
        console.error("Error creating admin profile:", profileError)
      }

      // Add user to admin_users table
      const { error: adminError } = await supabaseAdmin.from("admin_users").insert({
        user_id: data.user.id,
      })

      if (adminError) {
        console.error("Error adding user to admin_users:", adminError)
      }

      return { success: true, user: data.user, error: null }
    } catch (error) {
      console.error("Error creating admin user:", error)

      // Fallback to regular signup if admin creation fails
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: "admin@example.com",
        password: "admin123",
        options: {
          data: {
            first_name: "Admin",
            last_name: "User",
            is_admin: true,
          },
        },
      })

      if (signUpError) {
        return { success: false, user: null, error: signUpError }
      }

      return { success: true, user: data.user, error: null }
    }
  } catch (error) {
    console.error("Error in createAdminUser:", error)
    return { success: false, user: null, error }
  }
}
