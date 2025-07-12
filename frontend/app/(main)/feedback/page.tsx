"use client"

import { useState, useEffect } from "react"
import { Loader2, Star, User } from "lucide-react"
import { getAllFeedback } from "@/lib/services/feedback-service"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const feedbackData = await getAllFeedback()
        setFeedback(feedbackData || [])
      } catch (err: any) {
        console.error("Error fetching feedback:", err)
        setError(err.message || "Failed to load feedback")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading feedback...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Feedback</h1>
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Feedback</h1>
          <p className="text-gray-600 text-lg">
            See what our community members are saying about their skill swap experiences.
          </p>
        </div>

        {feedback.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Feedback Yet</h2>
            <p className="text-gray-600">Be the first to complete a skill swap and leave feedback!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {feedback.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.reviewer.avatar_url || "/placeholder.svg?height=48&width=48"}
                      alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.reviewer.first_name} {review.reviewer.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            reviewed {review.reviewee.first_name} {review.reviewee.last_name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                        </div>
                      </div>

                      {review.swap && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            Skill swap: <span className="font-medium">{review.swap.skill_offered?.name}</span> ↔{" "}
                            <span className="font-medium">{review.swap.skill_wanted?.name}</span>
                          </p>
                        </div>
                      )}

                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
