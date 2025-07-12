"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Plus, X } from "lucide-react"
import { getCurrentProfileClient } from "@/lib/auth/client"
import { updateProfile, getProfileById } from "@/lib/services/profile-service"
import {
  getAllSkills,
  addUserSkillOffered,
  addUserSkillWanted,
  removeUserSkillOffered,
  removeUserSkillWanted,
} from "@/lib/services/skills-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default async function EditProfilePage() {
  const router = useRouter() // Moved to top level
  const user = await getCurrentProfileClient() // Updated import

  if (!user) {
    window.location.href = "/login" // Redirect to login page if user is not logged in
    return null
  }

  const { data: profileData, error } = await getProfileById(user.id)

  if (error) {
    return <div className="p-6 text-red-500">Error loading profile: {error.message}</div>
  }

  if (!profileData) {
    return <div className="p-6 text-gray-500">Profile not found.</div>
  }

  const [profile, setProfile] = useState<any>(profileData)
  const [allSkills, setAllSkills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)

  // Form state
  const [firstName, setFirstName] = useState(profileData.first_name || "")
  const [lastName, setLastName] = useState(profileData.last_name || "")
  const [bio, setBio] = useState(profileData.bio || "")
  const [location, setLocation] = useState(profileData.location || "")
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url || "")
  const [contactEmail, setContactEmail] = useState(profileData.contact_email || "")

  // Skills state
  const [skillsOffered, setSkillsOffered] = useState<any[]>(profileData.user_skills_offered || [])
  const [skillsWanted, setSkillsWanted] = useState<any[]>(profileData.user_skills_wanted || [])
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [newSkillOfferedLevel, setNewSkillOfferedLevel] = useState("beginner")
  const [newSkillWantedPriority, setNewSkillWantedPriority] = useState("low")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setErrorState(null)
      try {
        const skillsData = await getAllSkills()
        setAllSkills(skillsData || [])
      } catch (err: any) {
        console.error("Error fetching skills:", err)
        setErrorState(err.message || "Failed to load skills")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setErrorState(null)

    try {
      await updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        bio: bio || null,
        location: location || null,
        avatar_url: avatarUrl || null,
        contact_email: contactEmail || null,
      })

      router.push("/profile")
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setErrorState(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkillOffered = async () => {
    if (!newSkillOffered || !profile) return

    const skill = allSkills.find((s) => s.name.toLowerCase() === newSkillOffered.toLowerCase())
    if (!skill) {
      setErrorState("Skill not found. Please select from available skills.")
      return
    }

    // Check if already added
    if (skillsOffered.some((s) => s.skills.id === skill.id)) {
      setErrorState("You already offer this skill")
      return
    }

    try {
      const newUserSkill = await addUserSkillOffered(profile.id, skill.id, newSkillOfferedLevel)
      setSkillsOffered([
        ...skillsOffered,
        {
          ...newUserSkill,
          skills: skill,
        },
      ])
      setNewSkillOffered("")
      setNewSkillOfferedLevel("beginner")
      setErrorState(null)
    } catch (err: any) {
      console.error("Error adding skill:", err)
      setErrorState(err.message || "Failed to add skill")
    }
  }

  const handleAddSkillWanted = async () => {
    if (!newSkillWanted || !profile) return

    const skill = allSkills.find((s) => s.name.toLowerCase() === newSkillWanted.toLowerCase())
    if (!skill) {
      setErrorState("Skill not found. Please select from available skills.")
      return
    }

    // Check if already added
    if (skillsWanted.some((s) => s.skills.id === skill.id)) {
      setErrorState("You already want to learn this skill")
      return
    }

    try {
      const newUserSkill = await addUserSkillWanted(profile.id, skill.id, newSkillWantedPriority)
      setSkillsWanted([
        ...skillsWanted,
        {
          ...newUserSkill,
          skills: skill,
        },
      ])
      setNewSkillWanted("")
      setNewSkillWantedPriority("low")
      setErrorState(null)
    } catch (err: any) {
      console.error("Error adding skill:", err)
      setErrorState(err.message || "Failed to add skill")
    }
  }

  const handleRemoveSkillOffered = async (skillId: string) => {
    if (!profile) return

    try {
      await removeUserSkillOffered(profile.id, skillId)
      setSkillsOffered(skillsOffered.filter((s) => s.skills.id !== skillId))
    } catch (err: any) {
      console.error("Error removing skill:", err)
      setErrorState(err.message || "Failed to remove skill")
    }
  }

  const handleRemoveSkillWanted = async (skillId: string) => {
    if (!profile) return

    try {
      await removeUserSkillWanted(profile.id, skillId)
      setSkillsWanted(skillsWanted.filter((s) => s.skills.id !== skillId))
    } catch (err: any) {
      console.error("Error removing skill:", err)
      setErrorState(err.message || "Failed to remove skill")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading profile...</span>
      </div>
    )
  }

  if (errorState && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-4">{errorState}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell others about yourself..."
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City, Country"
              />
            </div>

            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your-email@example.com"
              />
            </div>

            {/* Skills I Offer */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Offer</h2>

              {/* Add new skill offered */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Input
                  type="text"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  placeholder="Enter skill name..."
                  className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  list="skills-list"
                />
                <select
                  value={newSkillOfferedLevel}
                  onChange={(e) => setNewSkillOfferedLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <Button type="button" onClick={handleAddSkillOffered}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Current skills offered */}
              <div className="space-y-2">
                {skillsOffered.map((userSkill) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium">{userSkill.skills.name}</span>
                      <span className="text-sm text-gray-600 ml-2 capitalize">({userSkill.proficiency_level})</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSkillOffered(userSkill.skills.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills I Want */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>

              {/* Add new skill wanted */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Input
                  type="text"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  placeholder="Enter skill name..."
                  className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  list="skills-list"
                />
                <select
                  value={newSkillWantedPriority}
                  onChange={(e) => setNewSkillWantedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Button type="button" onClick={handleAddSkillWanted}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Current skills wanted */}
              <div className="space-y-2">
                {skillsWanted.map((userSkill) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <span className="font-medium">{userSkill.skills.name}</span>
                      <span className="text-sm text-gray-600 ml-2 capitalize">
                        ({userSkill.priority_level} priority)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSkillWanted(userSkill.skills.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills datalist */}
            <datalist id="skills-list">
              {allSkills.map((skill) => (
                <option key={skill.id} value={skill.name} />
              ))}
            </datalist>

            {/* Submit button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
