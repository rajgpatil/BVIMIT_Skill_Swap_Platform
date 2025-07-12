// This file is deprecated. Please use lib/auth/client.ts for client-side auth
// and lib/auth/server.ts for server-side auth.
// You can safely delete this file after updating all imports.

import { createServerClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

// Get the correct site URL for redirects
const getSiteUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://bvimitskillswap.vercel.app"
  }
  return "http://localhost:3000"
}

// Client-side authentication functions
export async function signUp(
  email: string,
  password: string,
  userData: {
    firstName: string
    lastName: string
  },
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })

  if (error) throw error

  // Create profile after successful signup
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email!,
      first_name: userData.firstName,
      last_name: userData.lastName,
    })

    if (profileError) throw profileError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Server-side helpers (uses next/headers)
export async function getCurrentUserServer() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfileServer(): Promise<Profile | null> {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return profile
}

// Client-side helpers (uses client supabase)
export async function getCurrentUserClient() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfileClient(): Promise<Profile | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
    *,
    user_skills_offered ( skill_id, proficiency_level, skills ( id, name, description ) ),
    user_skills_wanted  ( skill_id, priority_level,   skills ( id, name, description ) )
  `,
    )
    .eq("id", user.id)
    .single()

  if (error) throw error
  return data
}

export async function requireAuth() {
  const profile = await getCurrentProfileServer()
  if (!profile) {
    throw new Error("Authentication required")
  }
  return profile
}

export async function requireAuthClient() {
  const profile = await getCurrentProfileClient()
  if (!profile) {
    throw new Error("Authentication required")
  }
  return profile
}
