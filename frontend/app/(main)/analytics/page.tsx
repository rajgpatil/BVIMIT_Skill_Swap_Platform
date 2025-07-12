"use client"

import { useState, useEffect } from "react"
import { Loader2, BarChart, Clock, Star, CheckCheck } from "lucide-react" // Import Lucide icons
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for admin status
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    if (!isAdmin) {
      alert("Access Denied: You must be an admin to view this page.")
      router.push("/") // Redirect to home page
      return
    }

    const dummyAnalyticsData = {
      totalSwapsCompleted: "1,234",
      hoursExchanged: "5,678",
      averageRating: "4.8",
      popularLearnedSkills: ["Python", "Spanish", "Excel", "UI/UX Design", "Video Editing"],
      popularTaughtSkills: [
        "Web Development",
        "Graphic Design",
        "Digital Marketing",
        "Photography",
        "English Tutoring",
      ],
      activityLog: [
        "Completed 'Python Basics' swap with Alice.",
        "Received 5-star feedback from Bob for 'Graphic Design'.",
        "Initiated 'Spanish Conversation' swap with Charlie.",
        "Profile updated: added 'Video Editing' to skills wanted.",
        "Accepted a swap request for 'Digital Marketing'.",
        "Received 4-star feedback for 'English Tutoring'.",
      ],
    }

    const fetchAnalyticsData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAnalyticsData(dummyAnalyticsData)
      setIsLoading(false)
    }
    fetchAnalyticsData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" /> {/* Lucide icon */}
        <span className="ml-4 text-xl text-gray-700">Loading analytics...</span>
      </div>
    )
  }

  // If not loading and data is null, it means access was denied and redirected
  if (!analyticsData) {
    return null // Or a custom access denied component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Activity Analytics</h1>
          <p className="text-gray-600 text-lg">Track your learning progress and community engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <BarChart className="text-4xl text-blue-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Total Swaps Completed</p>
              <h2 className="text-3xl font-bold text-gray-900">{analyticsData?.totalSwapsCompleted}</h2>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <Clock className="text-4xl text-purple-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Hours Exchanged</p>
              <h2 className="text-3xl font-bold text-gray-900">{analyticsData?.hoursExchanged}</h2>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <Star className="text-4xl text-green-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Average Rating</p>
              <h2 className="text-3xl font-bold text-gray-900">{analyticsData?.averageRating}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Skills (Learned)</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <ul className="space-y-3">
                {analyticsData?.popularLearnedSkills.map((skill: string, index: number) => (
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    <span>{skill}</span>
                    <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 200) + 50} learners</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Skills (Taught)</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <ul className="space-y-3">
                {analyticsData?.popularTaughtSkills.map((skill: string, index: number) => (
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    <span>{skill}</span>
                    <span className="font-semibold text-purple-600">
                      {Math.floor(Math.random() * 150) + 30} teachers
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity Log</h2>
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <ul className="space-y-3 text-gray-700 text-sm">
              {analyticsData?.activityLog.map((activity: string, index: number) => (
                <li key={index} className="flex items-center">
                  <CheckCheck className="text-green-500 h-4 w-4 mr-2" /> {/* Lucide icon */}
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
