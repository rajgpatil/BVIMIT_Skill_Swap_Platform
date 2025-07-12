"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Search, ArrowRight, Users } from "lucide-react"
import { getAllSkills, getUsersWithSkill } from "@/lib/services/skills-service"

interface SkillWithUsers {
  id: string
  name: string
  description: string | null
  users: Array<{
    id: string
    proficiency_level: string
    profiles: {
      id: string
      first_name: string
      last_name: string
      bio: string | null
      avatar_url: string | null
      location: string | null
    }
  }>
}

export default function BrowseSkillsPage() {
  const [skills, setSkills] = useState<SkillWithUsers[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSkillsWithUsers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // First get all skills
        const allSkills = await getAllSkills()

        // Then get users for each skill
        const skillsWithUsers = await Promise.all(
          allSkills.map(async (skill) => {
            try {
              const users = await getUsersWithSkill(skill.id)
              return {
                ...skill,
                users: users || [],
              }
            } catch (err) {
              console.error(`Error fetching users for skill ${skill.name}:`, err)
              return {
                ...skill,
                users: [],
              }
            }
          }),
        )

        setSkills(skillsWithUsers)
      } catch (err: any) {
        console.error("Error fetching skills:", err)
        setError(err.message || "Failed to load skills")
        setSkills([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkillsWithUsers()
  }, [])

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading skills...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Skills</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Skills & Teachers</h1>
          <p className="text-gray-600 text-lg">Find people who can teach you the skills you want to learn.</p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for skills (e.g., JavaScript, Python, Spanish)..."
            className="w-full px-6 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div key={skill.id} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{skill.description || "No description available"}</p>

                {/* Show teacher count */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {skill.users.length} {skill.users.length === 1 ? "teacher" : "teachers"}
                  </span>
                  <Link href={`/skills/${skill.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All <ArrowRight className="inline-block h-4 w-4 ml-1" />
                  </Link>
                </div>

                {/* Show first few teachers */}
                {skill.users.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Available Teachers:</p>
                    {skill.users.slice(0, 3).map((userSkill) => (
                      <div key={userSkill.id} className="flex items-center space-x-2 p-2 bg-white rounded-md">
                        <img
                          src={userSkill.profiles.avatar_url || "/placeholder.svg?height=32&width=32"}
                          alt={`${userSkill.profiles.first_name} ${userSkill.profiles.last_name}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userSkill.profiles.first_name} {userSkill.profiles.last_name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{userSkill.proficiency_level} level</p>
                        </div>
                        <Link
                          href={`/profile/${userSkill.profiles.id}`}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                    {skill.users.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">+{skill.users.length - 3} more teachers</p>
                    )}
                  </div>
                )}

                {skill.users.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No teachers available yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to offer this skill!</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg">
              {searchTerm ? "No skills found matching your search." : "No skills available."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
