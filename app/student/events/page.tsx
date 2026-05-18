"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"
import type { Event } from "@/lib/types"
import { 
  Search, Calendar, MapPin, Users, Clock, 
  CalendarPlus, ExternalLink
} from "lucide-react"
import { format } from "date-fns"

export default function StudentEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, typeFilter, events])

  const loadEvents = async () => {
    try {
      const data = await api.events.getAll()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          (event.location || "").toLowerCase().includes(query)
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter)
    }

    setFilteredEvents(filtered)
  }

  const handleRegister = async (eventId: string) => {
    try {
      await api.events.register(eventId)
      const event = events.find((item) => item.id === eventId)
      if (event) setRegisteredEvents((prev) => prev.some((item) => item.id === eventId) ? prev : [...prev, event])
      // Update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId
            ? { ...e, isRegistered: true, attendees: (e.attendees || e.currentAttendees || 0) + 1 }
            : e
        )
      )
    } catch (error) {
      console.error("Failed to register:", error)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Discover and attend alumni events and networking opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Career Fair">Career Fair</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {registeredEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>My Registered Events</CardTitle>
              <CardDescription>Events you registered for in this session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {registeredEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium">{event.title}</span>
                  <Badge>Registered</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                {event.imageUrl && (
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-2 right-2">{event.type}</Badge>
                  </div>
                )}
                <CardContent className={event.imageUrl ? "pt-4" : "pt-6"}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 p-2 text-center min-w-[50px]">
                      <span className="text-xs font-medium text-primary">
                        {format(new Date(event.date || event.startDate), "MMM")}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {format(new Date(event.date || event.startDate), "d")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(event.date || event.startDate), "h:mm a")}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees || event.currentAttendees} attending</span>
                      {event.maxAttendees && (
                        <span className="text-muted-foreground">
                          / {event.maxAttendees} max
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    {event.isRegistered ? (
                      <Button variant="secondary" className="w-full" disabled>
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Registered
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleRegister(event.id)}
                        disabled={event.maxAttendees !== undefined && (event.attendees || event.currentAttendees) >= event.maxAttendees}
                      >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Register
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No events found</h3>
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
