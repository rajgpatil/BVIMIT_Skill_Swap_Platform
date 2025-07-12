"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSkillById } from "@/lib/services/skills-service"
import { getProfilesBySkillId } from "@/lib/services/profile-service"
import { getUser } from "@/lib/auth/client" // Updated import
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

export default function SkillDetailPageClient() {
  const params = useParams()
  const router = useRouter()
  const skillId = params.id as string

  const [skill, setSkill] = useState<any>(null)
  const [teachers, setTeachers] = useState<any[]>([])
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

        const { data: skillData, error: skillError } = await getSkillById(skillId)
        if (skillError) throw skillError
        setSkill(skillData)

        const { data: teachersData, error: teachersError } = await getProfilesBySkillId(skillId)
        if (teachersError) throw teachersError
        setTeachers(teachersData || [])
      } catch (err: any) {
        setError(err.message || "Failed to load skill details.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [skillId])

  if (loading) return <div className="p-6 text-center">Loading skill details...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
  if (!skill) return <div className="p-6 text-center">Skill not found.</div>

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{skill.name}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {skill.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Teachers</h3>
            {teachers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <Card key={teacher.id}>
                    <CardContent className="flex flex-col items-center p-4">
                      <Link href={`/profile/${teacher.id}`} className="text-center">
                        <img
                          src={teacher.avatar_url || "/placeholder-user.jpg"}
                          alt={teacher.name}
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                        <p className="font-semibold">{teacher.name}</p>
                        <p className="text-sm text-gray-500">{teacher.location}</p>
                      </Link>
                      {currentUser && currentUser.id !== teacher.id && (
                        <Link href={`/swaps/request/${teacher.id}?skillId=${skill.id}`} className="mt-2">
                          <Button variant="outline" size="sm">
                            Request Swap
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users currently offering this skill.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
