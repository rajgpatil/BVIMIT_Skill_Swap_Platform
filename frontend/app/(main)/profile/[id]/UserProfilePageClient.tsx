"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth/client" // Updated import
import { getProfile } from "@/lib/services/profile-service"
import { getSkillsByUserId } from "@/lib/services/skills-service"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

export default function UserProfilePageClient() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [profile, setProfile] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const user = await getUser()
        setCurrentUser(user)

        const { data: profileData, error: profileError } = await getProfile(userId)
        if (profileError) throw profileError
        setProfile(profileData)

        const { data: skillsData, error: skillsError } = await getSkillsByUserId(userId)
        if (skillsError) throw skillsError
        setSkills(skillsData || [])
      } catch (err: any) {
        setError(err.message || "Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
  if (!profile) return <div className="p-6 text-center">Profile not found.</div>

  const isCurrentUserProfile = currentUser && currentUser.id === userId

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} />
            <AvatarFallback>{profile.name ? profile.name[0].toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{profile.name || "No Name"}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {profile.location || "Location not specified"}
          </CardDescription>
          {isCurrentUserProfile && (
            <Link href="/profile/edit" className="mt-4">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          )}
          {!isCurrentUserProfile && currentUser && (
            <Link href={`/swaps/request/${userId}`} className="mt-4">
              <Button>Request Skill Swap</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Bio</h3>
            <p className="text-gray-700 dark:text-gray-300">{profile.bio || "No bio provided yet."}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <p className="text-gray-700 dark:text-gray-300">{profile.contact_email || "No contact email provided."}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills listed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
