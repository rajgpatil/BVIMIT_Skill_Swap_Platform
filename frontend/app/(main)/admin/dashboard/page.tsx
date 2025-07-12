"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Users, Repeat, Flag, ArrowRight } from "lucide-react" // Import Lucide icons
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
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

    const dummyDashboardData = {
      totalUsers: "52,345",
      totalSwaps: "105,890",
      reportedContent: "12",
      // Add more dummy data as needed for charts or tables
    }

    const fetchDashboardData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDashboardData(dummyDashboardData)
      setIsLoading(false)
    }
    fetchDashboardData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" /> {/* Lucide icon */}
        <span className="ml-4 text-xl text-gray-700">Loading admin dashboard...</span>
      </div>
    )
  }

  // If not loading and data is null, it means access was denied and redirected
  if (!dashboardData) {
    return null // Or a custom access denied component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Overview and management of the SkillSwap platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <Users className="text-4xl text-blue-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-900">{dashboardData?.totalUsers}</h2>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <Repeat className="text-4xl text-purple-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Total Swaps</p>
              <h2 className="text-3xl font-bold text-gray-900">{dashboardData?.totalSwaps}</h2>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 shadow-sm flex items-center space-x-4">
            <Flag className="text-4xl text-green-600 h-10 w-10" /> {/* Lucide icon */}
            <div>
              <p className="text-gray-600">Reported Content</p>
              <h2 className="text-3xl font-bold text-gray-900">{dashboardData?.reportedContent}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-4">
              <p className="text-gray-700">Manage user accounts, roles, and permissions.</p>
              <Link
                href="/admin/users"
                className="inline-block bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                View Users <ArrowRight className="inline-block h-4 w-4 ml-1" /> {/* Lucide icon */}
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Moderation</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-4">
              <p className="text-gray-700">Review and moderate reported profiles, skills, and feedback.</p>
              <Link
                href="/admin/content"
                className="inline-block bg-purple-500 text-white px-5 py-2 rounded-md hover:bg-purple-600 transition-colors"
              >
                Moderate Content <ArrowRight className="inline-block h-4 w-4 ml-1" /> {/* Lucide icon */}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Settings</h2>
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-4">
            <p className="text-gray-700">Configure platform-wide settings and announcements.</p>
            <Link
              href="/admin/settings"
              className="inline-block bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Manage Settings <ArrowRight className="inline-block h-4 w-4 ml-1" /> {/* Lucide icon */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
