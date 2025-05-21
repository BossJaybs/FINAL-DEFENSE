export type Profile = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export type Preferences = {
  id: string
  user_id: string
  theme: string
  email_notifications: boolean
  push_notifications: boolean
  weekly_summary: boolean
  goal_reminders: boolean
  language: string
  date_format: string
  created_at: string
  updated_at: string
}
