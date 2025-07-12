"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { getAllProfiles } from "@/lib/services/profile-service" // Import Supabase service
import { Button } from "@/components/ui/button"

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  useEffect(() => {
    const fetchPeople = async () => {
      setIsLoading(true)
      try {
        const data = await getAllProfiles()
        setPeople(data || [])
      } catch (error) {
        console.error("Error fetching people:", error)
        setPeople([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchPeople()
  }, [])

  // Calculate total pages
  const totalPages = Math.ceil(people.length / itemsPerPage)

  // Get people for the current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedPeople = people.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading people...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover People</h1>
          <p className="text-gray-600 text-lg">Connect with individuals ready to swap skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPeople.length > 0 ? (
            displayedPeople.map((person) => (
              <div key={person.id} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={person.avatar_url || "/placeholder.svg"}
                    alt={`${person.first_name} ${person.last_name}`}
                    className="w-16 h-16 rounded-full object-cover object-top mr-4 border-2 border-blue-200"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{`${person.first_name} ${person.last_name}`}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{person.bio}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {person.user_skills_offered?.map((userSkill: any, idx: number) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {userSkill.skills?.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills Wanted:</p>
                  <div className="flex flex-wrap gap-2">
                    {person.user_skills_wanted?.map((userSkill: any, idx: number) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {userSkill.skills?.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/profile/${person.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Profile <ArrowRight className="inline-block h-4 w-4 ml-1" />
                  </Link>
                  <Link
                    href={`/swaps/request/${person.id}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Request Swap
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg">No people found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
                className="h-9 w-9"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
