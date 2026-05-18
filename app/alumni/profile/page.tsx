"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { AlumniProfile } from "@/lib/types"
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Calendar, Edit, Save, X, Camera, Linkedin, Github, Globe,
  Building, Award
} from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<AlumniProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [accountMessage, setAccountMessage] = useState("")
  const [editForm, setEditForm] = useState({
    phone: "",
    location: "",
    company: "",
    jobTitle: "",
    bio: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: ""
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await api.alumni.getProfile()
      setProfile(data)
      setEditForm({
        phone: data.phone || "",
        location: data.location || "",
        company: data.company || "",
        jobTitle: data.jobTitle || "",
        bio: data.bio || "",
        skills: data.skills?.join(", ") || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        websiteUrl: data.websiteUrl || ""
      })
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return
    setIsSaving(true)
    try {
      const updatedProfile = await api.alumni.updateProfile({
        ...editForm,
        skills: editForm.skills.split(",").map(s => s.trim()).filter(Boolean)
      })
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const downloadMyData = () => {
    const blob = new Blob([JSON.stringify({ user, profile }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "alumni-profile-data.json"
    link.click()
    URL.revokeObjectURL(url)
    setAccountMessage("Your data export was generated.")
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your alumni profile and settings</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                      <AvatarFallback className="text-2xl">
                        {user?.name?.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={() => document.getElementById("alumni-avatar-upload")?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                    <input id="alumni-avatar-upload" type="file" className="hidden" accept="image/*" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
                  <p className="text-muted-foreground">{profile?.jobTitle || "Alumni"}</p>
                  {profile?.company && (
                    <p className="text-sm text-muted-foreground">at {profile.company}</p>
                  )}
                  <Badge className="mt-2" variant="secondary">
                    Class of {profile?.graduationYear || "2020"}
                  </Badge>
                  
                  <div className="mt-6 flex gap-2">
                    {profile?.linkedinUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile?.githubUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile?.websiteUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.department && (
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.department}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="about" className="space-y-4">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription>Share your story with the alumni community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {profile?.bio || "No bio added yet."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>Highlight your professional skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        value={editForm.skills}
                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                        placeholder="Enter skills separated by commas"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile?.skills?.length ? (
                          profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No skills added yet.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How others can reach you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.phone || "Not provided"}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.location || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.linkedinUrl}
                            onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.linkedinUrl || "Not provided"}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>GitHub</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.githubUrl}
                            onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                            placeholder="https://github.com/username"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.githubUrl || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Position</CardTitle>
                    <CardDescription>Your current work experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.jobTitle}
                            onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                            placeholder="Software Engineer"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.jobTitle || "Not provided"}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.company}
                            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                            placeholder="Company Name"
                          />
                        ) : (
                          <p className="text-muted-foreground">{profile?.company || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Your academic background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{profile?.department || "Computer Science"}</h4>
                        <p className="text-sm text-muted-foreground">AlumniConnect University</p>
                        <p className="text-sm text-muted-foreground">Class of {profile?.graduationYear || "2020"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control who can see your information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other alumni</p>
                      </div>
                      <Badge variant="secondary">Public</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Visibility</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your email</p>
                      </div>
                      <Badge variant="outline">Alumni Only</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Available for Mentoring</p>
                        <p className="text-sm text-muted-foreground">Show in mentor directory</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {accountMessage && <p className="text-sm text-muted-foreground">{accountMessage}</p>}
                    <Button variant="outline" className="w-full justify-start" onClick={() => setAccountMessage("Password change is handled from the login system in this local version.")}>
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={downloadMyData}>
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
