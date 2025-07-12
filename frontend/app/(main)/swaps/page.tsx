"use client"

import { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { getCurrentProfileClient } from "@/lib/auth/client"
import { updateSwapStatus } from "@/lib/services/swaps-service"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/server" // Updated import
import { getSwapsForUser } from "@/lib/services/swaps-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function SwapsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: swaps, error } = await getSwapsForUser(user.id)

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorClient, setErrorClient] = useState<string | null>(null)

  const fetchSwaps = async () => {
    setIsLoading(true)
    setErrorClient(null)
    try {
      const profile = await getCurrentProfileClient()
      if (!profile) {
        setErrorClient("Please log in to view your swaps")
        return
      }

      setCurrentUserId(profile.id)
    } catch (err: any) {
      console.error("Error fetching swaps:", err)
      setErrorClient(err.message || "Failed to load swaps")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSwaps()
  }, [])

  const handleUpdateSwapStatus = async (swapId: string, newStatus: string) => {
    try {
      await updateSwapStatus(swapId, newStatus)
      // Assuming swaps are fetched on client side as well, update state accordingly
      // This part might need adjustment based on actual implementation
    } catch (err: any) {
      console.error("Error updating swap status:", err)
      setErrorClient(err.message || "Failed to update swap status")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
        <span className="ml-4 text-xl text-gray-700">Loading swaps...</span>
      </div>
    )
  }

  if (error || errorClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Swaps</h1>
        <p className="text-gray-600 mb-4">{error?.message || errorClient}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const pendingSwaps = swaps.filter((swap) => swap.status === "pending")
  const activeSwaps = swaps.filter((swap) => swap.status === "accepted")
  const completedSwaps = swaps.filter((swap) => swap.status === "completed")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Skill Swaps</h1>
      {swaps && swaps.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Swaps</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Offered</TableHead>
                  <TableHead>Skill Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {swaps.map((swap) => (
                  <TableRow key={swap.id}>
                    <TableCell>{swap.offered_skill_name}</TableCell>
                    <TableCell>{swap.requested_skill_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          swap.status === "pending"
                            ? "secondary"
                            : swap.status === "accepted"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {swap.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/swaps/${swap.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">You don't have any active skill swaps yet.</p>
          <p className="mt-4">
            <Link href="/skills/browse">
              <Button>Browse Skills to Request</Button>
            </Link>
          </p>
        </div>
      )}

      {/* Pending Requests */}
      {pendingSwaps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Requests</h2>
          <div className="space-y-4">
            {pendingSwaps.map((swap) => {
              const isRequester = swap.requester_id === currentUserId
              const otherUser = isRequester ? swap.provider : swap.requester

              return (
                <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(swap.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {isRequester ? "Request Sent" : "Request Received"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isRequester
                            ? `To ${otherUser.first_name} ${otherUser.last_name}`
                            : `From ${otherUser.first_name} ${otherUser.last_name}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(swap.status)}`}
                    >
                      {swap.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Offering</p>
                      <p className="text-lg font-semibold text-blue-800">{swap.skill_offered.name}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Wanting</p>
                      <p className="text-lg font-semibold text-purple-800">{swap.skill_wanted.name}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/profile/${otherUser.id}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      View Profile <ArrowRight className="inline-block h-4 w-4 ml-1" />
                    </Link>

                    {!isRequester && swap.status === "pending" && (
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => handleUpdateSwapStatus(swap.id, "accepted")}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleUpdateSwapStatus(swap.id, "rejected")}>
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Swaps */}
      {activeSwaps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Swaps</h2>
          <div className="space-y-4">
            {activeSwaps.map((swap) => {
              const isRequester = swap.requester_id === currentUserId
              const otherUser = isRequester ? swap.provider : swap.requester

              return (
                <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(swap.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">Active Swap</h3>
                        <p className="text-sm text-gray-600">
                          With {otherUser.first_name} {otherUser.last_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(swap.status)}`}
                    >
                      {swap.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">You're Teaching</p>
                      <p className="text-lg font-semibold text-blue-800">{swap.skill_offered.name}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">You're Learning</p>
                      <p className="text-lg font-semibold text-purple-800">{swap.skill_wanted.name}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/profile/${otherUser.id}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      View Profile <ArrowRight className="inline-block h-4 w-4 ml-1" />
                    </Link>

                    <Button size="sm" onClick={() => handleUpdateSwapStatus(swap.id, "completed")}>
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Swaps */}
      {completedSwaps.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Swaps</h2>
          <div className="space-y-4">
            {completedSwaps.map((swap) => {
              const isRequester = swap.requester_id === currentUserId
              const otherUser = isRequester ? swap.provider : swap.requester

              return (
                <div key={swap.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(swap.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">Completed Swap</h3>
                        <p className="text-sm text-gray-600">
                          With {otherUser.first_name} {otherUser.last_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(swap.status)}`}
                    >
                      {swap.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">You Taught</p>
                      <p className="text-lg font-semibold text-blue-800">{swap.skill_offered.name}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">You Learned</p>
                      <p className="text-lg font-semibold text-purple-800">{swap.skill_wanted.name}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/profile/${otherUser.id}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      View Profile <ArrowRight className="inline-block h-4 w-4 ml-1" />
                    </Link>

                    <Link href={`/feedback/create?swap=${swap.id}&user=${otherUser.id}`}>
                      <Button size="sm" variant="outline">
                        Leave Feedback
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
