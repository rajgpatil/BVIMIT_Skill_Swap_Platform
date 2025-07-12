"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Edit, MapPin, Calendar, Star, User } from "lucide-react"
import { getCurrentProfileClient } from "@/lib/auth/client"
import { getProfileById } from "@/lib/services/profile-service"
import { getUserFeedback } from "@/lib/services/feedback-service"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/server" // Updated import

export default async function ProfilePage() {
  const user = await getUser()
  const [profile, setProfile] = useState<any>(null)
  const [feedback, setFeedback] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    redirect("/login")
    return null // Should not be reached due to redirect
  }

  // Redirect to the dynamic profile page for the current user
  redirect(`/profile/${user.id}`)
  return null // Should not be reached due to redirect

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const currentProfile = await getCurrentProfileClient()
        if (!currentProfile) {
          setError("Please log in to view your profile")
          return
        }

        const [profileData, feedbackData] = await Promise.all([
          getProfileById(currentProfile.id),
          getUserFeedback(currentProfile.id),
        ])

        setProfile(profileData)
        setFeedback(feedbackData || [])
      } catch (err: any) {
        console.error("Error fetching profile:", err)
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading profile...</span>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-4">{error || "Profile not found"}</p>
        <Link href="/profile/edit">
          <Button>Create Profile</Button>
        </Link>
      </div>
    )
  }

  const averageRating = feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <img
                src={profile.avatar_url || "/placeholder.svg?height=120&width=120"}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.location && (
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
                {profile.created_at && (
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <Link href="/profile/edit">
              <Button className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {profile.bio && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          {/* Rating */}
          {feedback.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({feedback.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Skills Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills I Offer */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills I Offer</h2>
            {profile.user_skills_offered && profile.user_skills_offered.length > 0 ? (
              <div className="space-y-3">
                {profile.user_skills_offered.map((userSkill: any) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{userSkill.skills.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{userSkill.proficiency_level} level</p>
                    </div>
                    <Link href={`/skills/${userSkill.skills.id}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      View Skill
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No skills offered yet</p>
                <Link href="/profile/edit">
                  <Button variant="outline">Add Skills</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Skills I Want */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills I Want to Learn</h2>
            {profile.user_skills_wanted && profile.user_skills_wanted.length > 0 ? (
              <div className="space-y-3">
                {profile.user_skills_wanted.map((userSkill: any) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{userSkill.skills.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{userSkill.priority_level} priority</p>
                    </div>
                    <Link
                      href={`/skills/${userSkill.skills.id}`}
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      Find Teachers
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No learning goals set</p>
                <Link href="/profile/edit">
                  <Button variant="outline">Add Learning Goals</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        {feedback.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Feedback</h2>
            <div className="space-y-4">
              {feedback.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.reviewer.avatar_url || "/placeholder.svg?height=32&width=32"}
                        alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {review.reviewer.first_name} {review.reviewer.last_name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {feedback.length > 5 && (
              <div className="text-center mt-4">
                <Button variant="outline">View All Feedback</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
