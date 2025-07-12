import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return JSON.parse(JSON.stringify({ success: false, message: error.message }))
  }

  return JSON.parse(JSON.stringify({ success: true, message: "Signed in successfully!" }))
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`,
    },
  })

  if (error) {
    return JSON.parse(JSON.stringify({ success: false, message: error.message }))
  }

  return JSON.parse(
    JSON.stringify({
      success: true,
      message: "Signed up successfully! Please check your email for a confirmation link.",
    }),
  )
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error.message)
  }
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error("Error fetching user:", error.message)
    return null
  }
  return user
}
