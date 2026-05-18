"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"
import type { AlumniProfile } from "@/lib/types"
import { 
  Search, Users, Briefcase, MapPin, GraduationCap, 
  MessageSquare, Send, Filter, Star
} from "lucide-react"

export default function MentorsPage() {
  const [mentors, setMentors] = useState<AlumniProfile[]>([])
  const [filteredMentors, setFilteredMentors] = useState<AlumniProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [requestTopic, setRequestTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [searchQuery, departmentFilter, mentors])

  const loadMentors = async () => {
    try {
      const data = await api.alumni.getAll()
      // Filter for those available for mentoring
      const availableMentors = data.filter(a => a.availableForMentoring)
      setMentors(availableMentors)
      setFilteredMentors(availableMentors)
    } catch (error) {
      console.error("Failed to load mentors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = mentors

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        mentor =>
          (mentor.name || `${mentor.firstName} ${mentor.lastName}`).toLowerCase().includes(query) ||
          mentor.company?.toLowerCase().includes(query) ||
          mentor.jobTitle?.toLowerCase().includes(query) ||
          mentor.skills?.some(skill => skill.toLowerCase().includes(query))
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(mentor => mentor.department === departmentFilter)
    }

    setFilteredMentors(filtered)
  }

  const handleRequestMentorship = async () => {
    if (!selectedMentor || !requestTopic) return
    
    setIsSubmitting(true)
    try {
      await api.mentorship.createRequest({
        mentorId: selectedMentor.userId,
        topic: requestTopic,
        message: requestMessage
      })
      setDialogOpen(false)
      setRequestMessage("")
      setRequestTopic("")
      setSelectedMentor(null)
      // Show success message (you could add a toast here)
    } catch (error) {
      console.error("Failed to send request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = ["Computer Science", "Electrical Engineering", "Business", "Medicine", "Law", "Arts"]

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find a Mentor</h1>
          <p className="text-muted-foreground">
            Connect with experienced alumni who can guide your career journey
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={mentor.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name || mentor.firstName}`} />
                      <AvatarFallback>
                        {(mentor.name || `${mentor.firstName} ${mentor.lastName}`).split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 font-semibold text-lg">{mentor.name || `${mentor.firstName} ${mentor.lastName}`}</h3>
                    {mentor.jobTitle && (
                      <p className="text-sm text-muted-foreground">{mentor.jobTitle}</p>
                    )}
                    {mentor.company && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{mentor.company}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {mentor.department && (
                        <Badge variant="secondary" className="text-xs">
                          <GraduationCap className="mr-1 h-3 w-3" />
                          {mentor.department}
                        </Badge>
                      )}
                      {mentor.location && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="mr-1 h-3 w-3" />
                          {mentor.location}
                        </Badge>
                      )}
                    </div>

                    {mentor.skills && mentor.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center mt-3">
                        {mentor.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}

                    <Dialog open={dialogOpen && selectedMentor?.id === mentor.id} onOpenChange={(open) => {
                      setDialogOpen(open)
                      if (open) setSelectedMentor(mentor)
                    }}>
                      <DialogTrigger asChild>
                        <Button className="mt-4 w-full" onClick={() => setSelectedMentor(mentor)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Request Mentorship
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Mentorship</DialogTitle>
                          <DialogDescription>
                            Send a mentorship request to {mentor.name || mentor.firstName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="topic">Topic / Area of Interest</Label>
                            <Select value={requestTopic} onValueChange={setRequestTopic}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="career-guidance">Career Guidance</SelectItem>
                                <SelectItem value="technical-skills">Technical Skills</SelectItem>
                                <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                                <SelectItem value="resume-review">Resume Review</SelectItem>
                                <SelectItem value="industry-insights">Industry Insights</SelectItem>
                                <SelectItem value="networking">Networking</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea
                              id="message"
                              placeholder="Introduce yourself and explain why you'd like to connect..."
                              value={requestMessage}
                              onChange={(e) => setRequestMessage(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleRequestMentorship} 
                            disabled={!requestTopic || isSubmitting}
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Request
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No mentors found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
