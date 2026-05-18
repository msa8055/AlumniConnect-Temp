'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '', requirements: '' });

  const loadJobs = () => api.jobs.getAll().then((data) => setJobs(data.filter((job) => job.postedBy === user?.id || user?.role === 'admin'))).catch(console.error);

  useEffect(() => {
    loadJobs();
  }, [user?.id]);

  const createJob = async () => {
    await api.jobs.create({ ...form, postedBy: user?.id || 'admin-1', type: 'full-time', status: 'open' } as any);
    setForm({ title: '', company: '', location: '', description: '', requirements: '' });
    loadJobs();
  };

  const deleteJob = async (id: string) => {
    await api.jobs.delete(id);
    loadJobs();
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Job Posts</h1>
          <p className="text-muted-foreground">Create, view, and remove real job posts.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Post a Job</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Requirements</Label><Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="One requirement per line" /></div>
            <Button onClick={createJob} disabled={!form.title || !form.company}>Save Job Post</Button>
          </CardContent>
        </Card>

        {jobs.length === 0 ? (
          <Card><CardContent className="p-12 text-center"><Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p>No job posts yet.</p></CardContent></Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                  <p className="mt-2 text-sm">{job.applicationsCount} applications</p>
                </div>
                <Button variant="outline" onClick={() => deleteJob(job.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
              </CardContent>
            </Card>
          ))
        )}
    </div>
  );
}
