"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Search, Filter, MapPin, Briefcase, GraduationCap,
  Linkedin, Mail, Users
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AlumniDirectoryPage() {
  const router = useRouter()
  const [alumni, setAlumni] = useState<AlumniProfile[]>([])
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAlumni()
  }, [])

  useEffect(() => {
    filterAlumni()
  }, [searchQuery, departmentFilter, yearFilter, alumni])

  const loadAlumni = async () => {
    try {
      const data = await api.alumni.getAll()
      setAlumni(data)
      setFilteredAlumni(data)
    } catch (error) {
      console.error("Failed to load alumni:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAlumni = () => {
    let filtered = alumni

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        a =>
          (a.name || `${a.firstName} ${a.lastName}`).toLowerCase().includes(query) ||
          a.company?.toLowerCase().includes(query) ||
          a.jobTitle?.toLowerCase().includes(query) ||
          a.location?.toLowerCase().includes(query)
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(a => a.department === departmentFilter)
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter(a => a.graduationYear?.toString() === yearFilter)
    }

    setFilteredAlumni(filtered)
  }

  const departments = ["Computer Science", "Electrical Engineering", "Business", "Medicine", "Law", "Arts"]
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"]

  const handleConnect = async (userId: string) => {
    await api.messages.createConversation(userId)
    router.push("/messages")
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="text-muted-foreground">
            Connect with fellow alumni from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>Class of {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </p>
        </div>

        {/* Alumni Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((alumnus, index) => (
            <motion.div
              key={alumnus.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={alumnus.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${alumnus.name || alumnus.firstName}`} />
                      <AvatarFallback>
                        {(alumnus.name || `${alumnus.firstName} ${alumnus.lastName}`).split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{alumnus.name || `${alumnus.firstName} ${alumnus.lastName}`}</h3>
                      {alumnus.jobTitle && (
                        <p className="text-sm text-muted-foreground truncate">{alumnus.jobTitle}</p>
                      )}
                      {alumnus.company && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Briefcase className="h-3 w-3" />
                          <span className="truncate">{alumnus.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {alumnus.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{alumnus.location}</span>
                      </div>
                    )}
                    {alumnus.department && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{alumnus.department} &apos;{alumnus.graduationYear?.toString().slice(-2)}</span>
                      </div>
                    )}
                  </div>

                  {alumnus.skills && alumnus.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {alumnus.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {alumnus.linkedinUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={alumnus.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleConnect(alumnus.id)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No alumni found</h3>
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
