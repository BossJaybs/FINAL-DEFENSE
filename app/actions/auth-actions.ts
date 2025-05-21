"use server"

import { supabaseAdmin } from "@/lib/supabase"

export async function serverSignUp(email: string, password: string, firstName: string, lastName: string) {
  try {
    // Create user with admin privileges to bypass RLS
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    })

    if (error) {
      return { user: null, error }
    }

    // Create profile for the user
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      user_id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return { user: null, error: profileError }
    }

    // Create preferences for the user
    const { error: preferencesError } = await supabaseAdmin.from("preferences").insert({
      user_id: data.user.id,
      theme: "system",
      email_notifications: true,
      push_notifications: true,
      weekly_summary: true,
      goal_reminders: true,
      language: "en",
      date_format: "mdy",
    })

    if (preferencesError) {
      console.error("Error creating preferences:", preferencesError)
      return { user: null, error: preferencesError }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error("Error in server signup:", error)
    return { user: null, error }
  }
}
