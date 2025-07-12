import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type Feedback = Database["public"]["Tables"]["feedback"]["Row"]
type FeedbackInsert = Database["public"]["Tables"]["feedback"]["Insert"]

export async function createFeedback(feedbackData: FeedbackInsert) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feedback")
    .insert(feedbackData)
    .select(`
      *,
      reviewer:profiles!feedback_reviewer_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      reviewee:profiles!feedback_reviewee_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      swap:swaps (
        id,
        skill_offered:skills!swaps_skill_offered_id_fkey (
          name
        ),
        skill_wanted:skills!swaps_skill_wanted_id_fkey (
          name
        )
      )
    `)
    .single()

  if (error) throw error
  return data
}

export async function getUserFeedback(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select(`
      *,
      reviewer:profiles!feedback_reviewer_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      reviewee:profiles!feedback_reviewee_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      swap:swaps (
        id,
        skill_offered:skills!swaps_skill_offered_id_fkey (
          name
        ),
        skill_wanted:skills!swaps_skill_wanted_id_fkey (
          name
        )
      )
    `)
    .eq("reviewee_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getAllFeedback() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select(`
      *,
      reviewer:profiles!feedback_reviewer_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      reviewee:profiles!feedback_reviewee_id_fkey (
        id,
        first_name,
        last_name,
        avatar_url
      ),
      swap:swaps (
        id,
        skill_offered:skills!swaps_skill_offered_id_fkey (
          name
        ),
        skill_wanted:skills!swaps_skill_wanted_id_fkey (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
