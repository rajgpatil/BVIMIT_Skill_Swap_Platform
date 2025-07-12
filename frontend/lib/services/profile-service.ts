import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export async function getProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating profile:", error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getProfilesBySkillId(skillId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profile_skills")
    .select(`
      profiles (
        id,
        name,
        avatar_url,
        location,
        bio,
        contact_email
      )
    `)
    .eq("skill_id", skillId)

  if (error) {
    console.error("Error fetching profiles by skill ID:", error)
    return { data: null, error }
  }

  // Flatten the data to get an array of profiles directly
  const profiles = data.map((item) => item.profiles).filter(Boolean)

  return { data: profiles, error: null }
}

export async function getAllProfiles() {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select(`
      id,
      name,
      avatar_url,
      location,
      bio,
      contact_email,
      skills:profile_skills(
        skill_id,
        skills(name)
      )
    `)

  if (error) {
    console.error("Error fetching all profiles:", error)
    return { data: null, error }
  }

  // Flatten skills for easier access
  const formattedData = data.map((profile) => ({
    ...profile,
    skills: profile.skills
      .map((ps) => ({
        id: ps.skill_id,
        name: ps.skills?.name,
      }))
      .filter((s) => s.name), // Filter out null names if any
  }))

  return { data: formattedData, error: null }
}
