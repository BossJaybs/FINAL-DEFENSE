import { createClient } from "@supabase/supabase-js"

// Default fallback values for development (these won't work in production)
const FALLBACK_URL = "https://your-project.supabase.co"
const FALLBACK_KEY = "your-anon-key"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_KEY

// Function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl !== FALLBACK_URL && supabaseAnonKey !== FALLBACK_KEY && supabaseUrl !== "" && supabaseAnonKey !== ""
  )
}

// Create a mock client that won't throw errors when methods are called
function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          maybeSingle: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          order: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          limit: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          range: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
          then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
        neq: () => ({
          then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
        order: () => ({
          then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
        limit: () => ({
          then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
        range: () => ({
          then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        }),
        then: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        match: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        match: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
      signUp: () =>
        Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      admin: {
        createUser: () => Promise.resolve({ data: { user: null }, error: new Error("Supabase not configured") }),
      },
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as any
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// For server-side rendering, we need to create a new client for each request
// For client-side rendering, we can reuse the same client
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: ReturnType<typeof createClient> | null = null

// Create a Supabase client with the anonymous key
export const supabase = (() => {
  // For SSR, always create a new client
  if (!isBrowser) {
    try {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    } catch (error) {
      console.error("Error initializing Supabase client on server:", error)
      return createMockClient()
    }
  }

  // For client-side, reuse the client if it exists
  if (supabaseClient) return supabaseClient

  // Only create the client if we have valid values
  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
      return supabaseClient
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      return createMockClient()
    }
  }

  console.warn("Supabase URL or Anon Key is missing. Using mock client.")
  return createMockClient()
})()

// Create a Supabase admin client with the service role key
export const supabaseAdmin = (() => {
  // For SSR, always create a new client
  if (!isBrowser) {
    try {
      return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    } catch (error) {
      console.error("Error initializing Supabase admin client on server:", error)
      return createMockClient()
    }
  }

  // For client-side, reuse the client if it exists
  if (supabaseAdminClient) return supabaseAdminClient

  // Only create the admin client if we have valid values
  if (supabaseUrl && supabaseServiceRoleKey && supabaseServiceRoleKey !== FALLBACK_KEY) {
    try {
      supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
      return supabaseAdminClient
    } catch (error) {
      console.error("Error initializing Supabase admin client:", error)
      return createMockClient()
    }
  }

  console.warn("Supabase URL or Service Role Key is missing. Using mock client for admin.")
  return createMockClient()
})()
