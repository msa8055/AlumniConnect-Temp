"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import type { Student, MentorshipRequest } from "@/lib/types"
import { Users, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AlumniMentorshipPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [mentees, setMentees] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [requestsData, usersData] = await Promise.all([
        api.getMentorshipRequests(),
        api.getUsers(),
      ])
      setRequests(requestsData)
      setMentees(usersData.filter((u) => u.role === "student") as Student[])
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, action: "accept" | "reject") => {
    try {
      await api.updateMentorshipRequest(requestId, action === "accept" ? "ACCEPTED" : "REJECTED")
      loadData()
    } catch (error) {
      console.error("Failed to update request:", error)
    }
  }

  const messageStudent = async (studentId: string) => {
    await api.messages.createConversation(studentId)
    router.push("/messages")
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const acceptedRequests = requests.filter((r) => r.status === "active" || r.status === "accepted")
  const completedRequests = requests.filter((r) => r.status === "completed")

  const getStatusBadge = (status: MentorshipRequest["status"]) => {
    const variants: Record<MentorshipRequest["status"], { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      active: { className: "bg-green-100 text-green-800", label: "Active" },
      accepted: { className: "bg-green-100 text-green-800", label: "Active" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
      completed: { className: "bg-blue-100 text-blue-800", label: "Completed" },
      cancelled: { className: "bg-gray-100 text-gray-800", label: "Cancelled" },
      PENDING: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      ACCEPTED: { className: "bg-green-100 text-green-800", label: "Active" },
      REJECTED: { className: "bg-red-100 text-red-800", label: "Rejected" },
      COMPLETED: { className: "bg-blue-100 text-blue-800", label: "Completed" },
    }
    return variants[status]
  }

  if (loading) {
    return (
      <DashboardLayout role="alumni">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="alumni">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mentorship</h1>
          <p className="text-muted-foreground mt-1">Manage your mentorship connections and requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{acceptedRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Active Mentees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active Mentees ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    You&apos;ll see new mentorship requests here when students reach out
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => {
                const mentee = mentees.find((m) => m.id === request.menteeId)
                return (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {mentee?.firstName?.[0]}
                              {mentee?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {mentee?.firstName} {mentee?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {mentee?.major} - Class of {mentee?.expectedGraduation}
                            </p>
                            <p className="mt-2 text-sm">{request.message}</p>
                            {request.topics && request.topics.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {request.topics.map((topic, i) => (
                                  <Badge key={i} variant="secondary">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(request.id, "accept")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestAction(request.id, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active mentees</h3>
                  <p className="text-muted-foreground">
                    Accept mentorship requests to start mentoring students
                  </p>
                </CardContent>
              </Card>
            ) : (
              acceptedRequests.map((request) => {
                const mentee = mentees.find((m) => m.id === request.menteeId)
                return (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold">
                              {mentee?.firstName?.[0]}
                              {mentee?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {mentee?.firstName} {mentee?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {mentee?.major} - Class of {mentee?.expectedGraduation}
                            </p>
                            <Badge className="mt-2 bg-green-100 text-green-800">
                              Active Mentorship
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => messageStudent(request.menteeId)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/users?user=${request.menteeId}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed mentorships</h3>
                  <p className="text-muted-foreground">
                    Completed mentorship relationships will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedRequests.map((request) => {
                const mentee = mentees.find((m) => m.id === request.menteeId)
                const status = getStatusBadge(request.status)
                return (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {mentee?.firstName?.[0]}
                              {mentee?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {mentee?.firstName} {mentee?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {mentee?.major} - Class of {mentee?.expectedGraduation}
                            </p>
                            <Badge className={`mt-2 ${status.className}`}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
