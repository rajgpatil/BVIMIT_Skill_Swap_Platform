import { createClient } from "@/lib/supabase/server"

export async function getAllSkills() {
  const supabase = createClient()
  const { data, error } = await supabase.from("skills").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching all skills:", error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getSkillById(skillId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("skills").select("*").eq("id", skillId).single()

  if (error) {
    console.error("Error fetching skill by ID:", error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getSkillsByUserId(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profile_skills")
    .select(`
      skill_id,
      skills (
        id,
        name,
        description
      )
    `)
    .eq("profile_id", userId)

  if (error) {
    console.error("Error fetching skills by user ID:", error)
    return { data: null, error }
  }

  // Flatten the data to get an array of skills directly
  const skills = data.map((item) => item.skills).filter(Boolean)

  return { data: skills, error: null }
}
