"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Event, Job, MentorshipRequest } from "@/lib/types"
import { 
  BookOpen, Users, Briefcase, Calendar, 
  GraduationCap, Target, Clock, ArrowRight,
  TrendingUp, Award, MessageSquare
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [eventsData, jobsData, mentorshipData] = await Promise.all([
        api.events.getAll(),
        api.jobs.getAll(),
        api.mentorship.getRequests()
      ])
      setEvents(eventsData.slice(0, 3))
      setJobs(jobsData.slice(0, 3))
      setMentorshipRequests(mentorshipData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    {
      title: "Active Mentorships",
      value: mentorshipRequests.filter(r => r.status === "accepted" || r.status === "active").length.toString(),
      icon: Users,
      description: "With alumni mentors",
      color: "text-blue-600"
    },
    {
      title: "Job Applications",
      value: "5",
      icon: Briefcase,
      description: "Submitted this month",
      color: "text-green-600"
    },
    {
      title: "Events Attended",
      value: "8",
      icon: Calendar,
      description: "This semester",
      color: "text-purple-600"
    },
    {
      title: "Profile Completion",
      value: "75%",
      icon: Target,
      description: "Complete your profile",
      color: "text-orange-600"
    }
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              {"Here's what's happening in your student journey"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/student/mentors">
                <Users className="mr-2 h-4 w-4" />
                Find a Mentor
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Complete Your Profile
                </CardTitle>
                <CardDescription>
                  A complete profile helps mentors and employers find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile Completion</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Complete these steps:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="line-through">Add profile photo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="line-through">Complete basic info</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span>Add your skills</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <span>Upload resume</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/student/profile">
                    Complete Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Mentorships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Mentorships
                </CardTitle>
                <CardDescription>
                  Your active mentorship connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mentorshipRequests.filter(r => r.status === "accepted" || r.status === "active").length > 0 ? (
                  <div className="space-y-4">
                    {mentorshipRequests
                      .filter(r => r.status === "accepted" || r.status === "active")
                      .slice(0, 2)
                      .map((request) => (
                        <div key={request.id} className="flex items-center gap-4 rounded-lg border p-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{request.mentorName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.topic}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No active mentorships</p>
                    <Button className="mt-4" asChild>
                      <Link href="/student/mentors">Find a Mentor</Link>
                    </Button>
                  </div>
                )}
                {mentorshipRequests.filter(r => r.status === "accepted" || r.status === "active").length > 0 && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/student/mentorship">
                      View All Mentorships
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events you might be interested in</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/student/events">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 p-2 text-center min-w-[50px]">
                        <span className="text-xs font-medium text-primary">
                          {new Date(event.date || event.startDate).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {new Date(event.date || event.startDate).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{event.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Job Opportunities</CardTitle>
                    <CardDescription>Latest openings from alumni companies</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/student/jobs">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {job.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{job.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Resources
            </CardTitle>
            <CardDescription>Uploaded resources will appear here when added.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No resources uploaded yet.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
