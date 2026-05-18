"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Camera, Save, GraduationCap, Mail, Phone, MapPin, Calendar, BookOpen } from "lucide-react"

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "",
    graduationYear: user?.expectedGraduation || new Date().getFullYear(),
    degree: "",
    major: user?.major || "",
    bio: "",
    skills: user?.interests || [],
    linkedinUrl: "",
    gpa: user?.gpa?.toString() || "",
  })

  const handleSave = async () => {
    if (user?.id) {
      await api.students.update(user.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        major: profile.major,
        expectedGraduation: Number(profile.graduationYear),
        gpa: Number(profile.gpa) || undefined,
        interests: profile.skills,
      })
    }
    setIsEditing(false)
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your profile information</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile.firstName[0]}
                        {profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={() => document.getElementById("student-avatar-upload")?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                    <input id="student-avatar-upload" type="file" className="hidden" accept="image/*" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <Badge variant="secondary" className="mt-2">
                    Student
                  </Badge>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Class of {profile.graduationYear}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {profile.major}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="ghost" size="sm" className="mt-3 w-full">
                    + Add Skill
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.firstName}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.phone}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.location}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="graduationYear">Expected Graduation</Label>
                    {isEditing ? (
                      <Input
                        id="graduationYear"
                        type="number"
                        value={profile.graduationYear}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            graduationYear: parseInt(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.graduationYear}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gpa">GPA</Label>
                    {isEditing ? (
                      <Input
                        id="gpa"
                        value={profile.gpa}
                        onChange={(e) =>
                          setProfile({ ...profile, gpa: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm py-2">{profile.gpa}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="degree">Degree</Label>
                  {isEditing ? (
                    <Input
                      id="degree"
                      value={profile.degree}
                      onChange={(e) =>
                        setProfile({ ...profile, degree: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.degree}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="major">Major</Label>
                  {isEditing ? (
                    <Input
                      id="major"
                      value={profile.major}
                      onChange={(e) =>
                        setProfile({ ...profile, major: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.major}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Tell others about yourself</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="Write a brief description about yourself..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
