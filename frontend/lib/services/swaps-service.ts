import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type SwapRequest = Database["public"]["Tables"]["skill_swaps"]["Insert"]

export async function createSwapRequest(swapRequest: SwapRequest) {
  const supabase = createClient()
  const { data, error } = await supabase.from("skill_swaps").insert(swapRequest).select().single()

  if (error) {
    console.error("Error creating swap request:", error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getSwapsForUser(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("skill_swaps")
    .select(`
      id,
      status,
      message,
      created_at,
      requester:requester_id(id, name, avatar_url),
      requested_user:requested_user_id(id, name, avatar_url),
      offered_skill:offered_skill_id(id, name),
      requested_skill:requested_skill_id(id, name)
    `)
    .or(`requester_id.eq.${userId},requested_user_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching swaps:", error)
    return { data: null, error }
  }

  // Map data to flatten skill names for easier access
  const formattedData = data.map((swap) => ({
    ...swap,
    requester_name: swap.requester?.name,
    requested_user_name: swap.requested_user?.name,
    offered_skill_name: swap.offered_skill?.name,
    requested_skill_name: swap.requested_skill?.name,
  }))

  return { data: formattedData, error: null }
}

export async function getSwapById(swapId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("skill_swaps")
    .select(`
      id,
      status,
      message,
      created_at,
      requester:requester_id(id, name, avatar_url),
      requested_user:requested_user_id(id, name, avatar_url),
      offered_skill:offered_skill_id(id, name),
      requested_skill:requested_skill_id(id, name)
    `)
    .eq("id", swapId)
    .single()

  if (error) {
    console.error("Error fetching swap:", error)
    return { data: null, error }
  }

  const formattedData = data
    ? {
        ...data,
        requester_name: data.requester?.name,
        requested_user_name: data.requested_user?.name,
        offered_skill_name: data.offered_skill?.name,
        requested_skill_name: data.requested_skill?.name,
      }
    : null

  return { data: formattedData, error: null }
}

export async function updateSwapStatus(swapId: string, status: "pending" | "accepted" | "rejected") {
  const supabase = createClient()
  const { data, error } = await supabase.from("skill_swaps").update({ status }).eq("id", swapId).select().single()

  if (error) {
    console.error("Error updating swap status:", error)
    return { data: null, error }
  }
  return { data, error: null }
}
