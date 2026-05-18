'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Briefcase, ExternalLink, MapPin, Plus, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function AlumniJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState('');

  const loadJobs = () => api.jobs.getAll().then(setJobs).catch(console.error);

  useEffect(() => {
    loadJobs();
  }, []);

  const apply = async (job: Job) => {
    await api.jobs.apply(job.id, { coverLetter: 'Applied from AlumniConnect' });
    setMessage(`Application submitted for ${job.title}.`);
    loadJobs();
  };

  const save = async (job: Job) => {
    await api.jobs.save(job.id);
    setMessage(`${job.title} saved.`);
  };

  const share = async (job: Job) => {
    const text = `${job.title} at ${job.company}`;
    await navigator.clipboard?.writeText(`${text} - ${window.location.href}`);
    setMessage('Job link copied to clipboard.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">Live jobs posted by alumni and admins.</p>
        </div>
        <Button asChild>
          <Link href="/alumni/my-jobs"><Plus className="h-4 w-4 mr-2" />Post a Job</Link>
        </Button>
      </div>

      {message && <div className="rounded-md border bg-muted/40 p-3 text-sm">{message}</div>}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No jobs posted yet</h3>
            <p className="text-muted-foreground">New real-time job posts will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                      <Badge variant="outline">{job.type}</Badge>
                      <span>{job.applicationsCount} applications</span>
                    </div>
                    <p className="max-w-3xl text-sm text-muted-foreground">{job.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => save(job)}><Bookmark className="h-4 w-4 mr-2" />Save Job</Button>
                    <Button variant="outline" onClick={() => share(job)}><Share2 className="h-4 w-4 mr-2" />Share</Button>
                    <Button onClick={() => apply(job)}>Apply Now<ExternalLink className="h-4 w-4 ml-2" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
