"use client"

import { useState, useEffect, useActionState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { getUser } from "@/lib/auth/client" // Updated import
import { getProfile } from "@/lib/services/profile-service"
import { getSkillById } from "@/lib/services/skills-service"
import { createSwapRequest } from "@/lib/services/swaps-service"
import type { User } from "@supabase/supabase-js"

export default function RequestSwapPageClient() {
  const params = useParams()
  const router = useRouter()
  const requestedUserId = params.id as string

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [requestedUserProfile, setRequestedUserProfile] = useState<any>(null)
  const [requestedSkill, setRequestedSkill] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [swapState, swapAction] = useActionState(async (prevState: any, formData: FormData) => {
    const message = formData.get("message") as string
    const offeredSkillId = formData.get("offeredSkillId") as string
    const requestedSkillId = formData.get("requestedSkillId") as string

    if (!currentUser || !offeredSkillId || !requestedSkillId || !requestedUserId) {
      return { success: false, message: "Missing required information for swap request." }
    }

    const { data, error } = await createSwapRequest({
      requester_id: currentUser.id,
      requested_user_id: requestedUserId,
      offered_skill_id: offeredSkillId,
      requested_skill_id: requestedSkillId,
      message,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: "Swap request sent successfully!", swapId: data?.id }
  }, null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const user = await getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setCurrentUser(user)

        const { data: profileData, error: profileError } = await getProfile(requestedUserId)
        if (profileError) throw profileError
        setRequestedUserProfile(profileData)

        // Assuming the ID in the URL is for the skill being requested from the user
        // This might need adjustment based on how you link to this page
        // For now, let's assume the user is requesting a skill from the profile they are viewing
        // and the skill ID is passed as a query param or part of the URL if it's a specific skill request.
        // If the URL is just /swaps/request/[userId], then the user will select the skill they want to request.
        // For this example, let's assume the user will select the skill they want to request from the requestedUserProfile's skills.

        // If you want to pre-fill a specific skill, you'd need to pass its ID via query params
        // e.g., /swaps/request/user-id?skillId=skill-id
        const skillIdFromQuery = new URLSearchParams(window.location.search).get("skillId")
        if (skillIdFromQuery) {
          const { data: skillData, error: skillError } = await getSkillById(skillIdFromQuery)
          if (skillError) throw skillError
          setRequestedSkill(skillData)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data.")
        toast({
          title: "Error",
          description: err.message || "Failed to load data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [requestedUserId, router])

  useEffect(() => {
    if (swapState?.message) {
      toast({
        title: swapState.success ? "Success" : "Error",
        description: swapState.message,
        variant: swapState.success ? "default" : "destructive",
      })
      if (swapState.success) {
        router.push("/swaps") // Redirect to swaps page on success
      }
    }
  }, [swapState, router])

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
  if (!requestedUserProfile) return <div className="p-6 text-center">User profile not found.</div>
  if (!currentUser) return <div className="p-6 text-center">Please log in to request a swap.</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request Skill Swap with {requestedUserProfile.name}</CardTitle>
          <CardDescription>
            You are about to request a skill swap with {requestedUserProfile.name}. Please specify the skill you are
            offering and the skill you are requesting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={swapAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offeredSkill">Your Skill to Offer</Label>
              {/* This should be a dropdown of current user's skills */}
              <select
                id="offeredSkill"
                name="offeredSkillId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a skill you can offer</option>
                {currentUser.user_metadata?.skills?.map((skill: any) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedSkill">Skill to Request from {requestedUserProfile.name}</Label>
              {/* This should be a dropdown of the requested user's skills */}
              <select
                id="requestedSkill"
                name="requestedSkillId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a skill to request</option>
                {requestedUserProfile.skills?.map((skill: any) => (
                  <option key={skill.id} value={skill.id} selected={requestedSkill?.id === skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Hi, I'd love to swap skills with you..." rows={5} />
            </div>
            <Button type="submit" className="w-full">
              Send Swap Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
