'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, Heart, MessageCircle, TrendingUp, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, isAlumni } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { Event, Job, MentorshipRequest } from '@/lib/types';

export default function AlumniDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipRequest[]>([]);

  useEffect(() => {
    Promise.all([api.jobs.getAll(), api.events.getAll(), api.mentorship.getAll()])
      .then(([jobsData, eventsData, mentorshipData]) => {
        setJobs(jobsData);
        setEvents(eventsData);
        setMentorships(mentorshipData);
      })
      .catch(console.error);
  }, []);

  const alumni = isAlumni(user) ? user : null;
  const myJobs = jobs.filter((job) => job.postedBy === user?.id);
  const myMentorships = mentorships.filter((m) => m.mentorId === user?.id && (m.status === 'active' || m.status === 'accepted'));
  const upcomingEvents = events.filter((event) => event.status === 'upcoming').slice(0, 3);

  const stats = [
    { title: 'Jobs Posted', value: myJobs.length, icon: Briefcase, href: '/alumni/my-jobs' },
    { title: 'Active Mentees', value: myMentorships.length, icon: Heart, href: '/alumni/mentorship' },
    { title: 'Upcoming Events', value: upcomingEvents.length, icon: Calendar, href: '/alumni/events' },
    { title: 'Profile Views', value: 0, icon: Eye, href: '/alumni/profile' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Alumni'}!</h1>
          <p className="text-muted-foreground">
            {alumni?.currentPosition || 'Keep your profile updated so students can find you.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/alumni/my-jobs"><Briefcase className="h-4 w-4 mr-2" />Post a Job</Link>
          </Button>
          <Button asChild>
            <Link href="/messages"><MessageCircle className="h-4 w-4 mr-2" />Messages</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <stat.icon className="h-5 w-5 text-primary mb-4" />
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Mentees</CardTitle>
          </CardHeader>
          <CardContent>
            {myMentorships.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active mentees yet. Accepted mentorship requests will appear here.</p>
            ) : (
              <div className="space-y-3">
                {myMentorships.map((m) => (
                  <div key={m.id} className="rounded-lg border p-3">
                    <p className="font-medium">{m.menteeName || 'Student'}</p>
                    <p className="text-sm text-muted-foreground">{m.topic}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events have been created yet.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(event.startDate).toLocaleString()}</p>
                    <Badge variant="outline" className="mt-2">{event.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Post a Job', href: '/alumni/my-jobs', icon: Briefcase },
              { label: 'Create Event', href: '/admin/events', icon: Calendar },
              { label: 'Browse Students', href: '/admin/users', icon: Users },
              { label: 'Update Profile', href: '/alumni/profile', icon: TrendingUp },
            ].map((action) => (
              <Button key={action.label} variant="outline" className="h-auto py-4" asChild>
                <Link href={action.href} className="flex flex-col gap-2">
                  <action.icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
