import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type {
  Alumni,
  Student,
  Admin,
  User,
  Job,
  Event,
  MentorshipRequest,
  Conversation,
  Message,
  Notification,
  JobApplication,
  EventRegistration,
} from '@/lib/types';

export const runtime = 'nodejs';

type Db = {
  users: (Alumni | Student | Admin)[];
  jobs: Job[];
  events: Event[];
  mentorships: MentorshipRequest[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  jobApplications: JobApplication[];
  eventRegistrations: EventRegistration[];
  savedJobs: { id: string; userId: string; jobId: string; savedAt: string }[];
};

const dbFile = join(process.cwd(), 'backend', 'database', 'db.json');

function stamp<T extends { createdAt?: string; updatedAt?: string }>(item: T): T {
  const now = new Date().toISOString();
  return { ...item, createdAt: item.createdAt || now, updatedAt: item.updatedAt || now };
}

function enhanceUser<T extends User>(user: T): T {
  const name = `${user.firstName} ${user.lastName}`.trim();
  const alumni = user.role === 'alumni' ? (user as unknown as Alumni) : null;
  return {
    ...user,
    password: user.password || 'password123',
    name,
    avatarUrl: user.avatar,
    userId: user.id,
    company: alumni?.currentCompany,
    jobTitle: alumni?.currentPosition,
    department: alumni?.major || (user as unknown as Student).major || (user as unknown as Admin).department,
    availableForMentoring: alumni?.isAvailableForMentoring,
  };
}

function enhanceJob(job: Job): Job {
  return {
    ...job,
    postedAt: job.createdAt,
    salaryMin: job.salary?.min ?? job.salaryMin,
    salaryMax: job.salary?.max ?? job.salaryMax,
  };
}

type UiEventType = NonNullable<Event['eventType']>;

function apiEventType(type?: string): UiEventType {
  const value = (type || 'networking').toLowerCase().replace(/_/g, '-');
  const map: Record<string, UiEventType> = {
    networking: 'NETWORKING',
    workshop: 'WORKSHOP',
    seminar: 'SEMINAR',
    reunion: 'REUNION',
    'career-fair': 'CAREER_FAIR',
    webinar: 'WEBINAR',
    social: 'OTHER',
  };
  return map[value] || 'OTHER';
}

function enhanceEvent(event: Event): Event {
  return {
    ...event,
    date: event.startDate,
    attendees: event.currentAttendees,
    eventType: event.eventType || apiEventType(event.type),
  };
}

let memoryDb: Db | null = null;

function seedDb(): Db {
  return {
    users: [
      enhanceUser({
        id: 'admin-1',
        email: 'admin@university.edu',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        department: 'Alumni Relations',
        permissions: ['manage_users', 'manage_jobs', 'manage_events', 'view_reports', 'manage_settings'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Admin),
    ],
    jobs: [],
    events: [],
    mentorships: [],
    conversations: [],
    messages: [],
    notifications: [],
    jobApplications: [],
    eventRegistrations: [],
    savedJobs: [],
  };
}

function loadDb(): Db {
  if (memoryDb) return memoryDb;
  if (!existsSync(dbFile)) {
    memoryDb = seedDb();
    saveDb(memoryDb);
    return memoryDb;
  }
  memoryDb = JSON.parse(readFileSync(dbFile, 'utf8')) as Db;
  memoryDb.users = memoryDb.users.map((user) => enhanceUser(user));
  memoryDb.savedJobs ||= [];
  return memoryDb;
}

function saveDb(db: Db) {
  mkdirSync(dirname(dbFile), { recursive: true });
  writeFileSync(dbFile, JSON.stringify(db, null, 2));
  memoryDb = db;
}

function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

function getUser(id?: string) {
  if (!id) return undefined;
  return loadDb().users.find((user) => user.id === id);
}

function normalizeJob(input: Partial<Job> & Record<string, unknown>): Job {
  const now = new Date().toISOString();
  const rawRequirements = (input as any).requirements;
  const requirements =
    typeof rawRequirements === 'string'
      ? rawRequirements.split('\n').map((r: string) => r.trim()).filter(Boolean)
      : rawRequirements || [];
  const typeMap: Record<string, Job['type']> = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    REMOTE: 'remote',
  };
  const salaryMin = Number(input.salaryMin || input.salary?.min || 0);
  const salaryMax = Number(input.salaryMax || input.salary?.max || 0);
  return stamp({
    id: `job-${Date.now()}`,
    title: input.title || 'Untitled Job',
    company: input.company || 'Company',
    location: input.location || 'Remote',
    type: typeMap[String(input.type)] || (input.type as Job['type']) || 'full-time',
    status: input.status || 'open',
    description: input.description || '',
    requirements,
    salary: salaryMin || salaryMax ? { min: salaryMin, max: salaryMax, currency: 'USD' } : undefined,
    salaryMin,
    salaryMax,
    postedBy: String(input.postedBy || 'admin-1'),
    applicationsCount: 0,
    createdAt: now,
    updatedAt: now,
  });
}

function normalizeEvent(input: Partial<Event> & Record<string, unknown>): Event {
  const now = new Date().toISOString();
  const eventType = String(input.eventType || input.type || 'NETWORKING') as UiEventType;
  const typeMap: Record<string, Event['type']> = {
    NETWORKING: 'networking',
    WORKSHOP: 'workshop',
    SEMINAR: 'seminar',
    REUNION: 'reunion',
    CAREER_FAIR: 'career-fair',
    WEBINAR: 'webinar',
    OTHER: 'social',
  };
  return stamp({
    id: `event-${Date.now()}`,
    title: input.title || 'Untitled Event',
    description: input.description || '',
    type: typeMap[eventType] || (input.type as Event['type']) || 'networking',
    eventType,
    status: input.status || 'upcoming',
    startDate: input.startDate || now,
    endDate: input.endDate || input.startDate || now,
    date: input.startDate || now,
    location: input.location || (input.isVirtual ? 'Virtual' : 'Campus'),
    isVirtual: Boolean(input.isVirtual),
    virtualLink: input.virtualLink,
    maxAttendees: Number(input.maxAttendees || 100),
    currentAttendees: 0,
    attendees: 0,
    organizer: String(input.organizer || input.organizerId || 'admin-1'),
    tags: input.tags || [],
    createdAt: now,
    updatedAt: now,
  });
}

async function handle(request: NextRequest, params: { path?: string[] }) {
  const db = loadDb();
  const path = params.path || [];
  const [resource, id, sub] = path;
  const method = request.method;
  const body = method === 'GET' ? null : await request.json().catch(() => ({}));
  const url = new URL(request.url);

  if (resource === 'auth' && id === 'login' && method === 'POST') {
    const user = db.users.find((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase());
    if (!user || user.password !== body.password) return fail('Invalid email or password', 401);
    return ok({
      user,
      token: `local-token-${user.id}-${Date.now()}`,
      refreshToken: `local-refresh-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (resource === 'auth' && id === 'register' && method === 'POST') {
    if (db.users.some((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase())) {
      return fail('An account with this email already exists');
    }
    const now = new Date().toISOString();
    const base = {
      id: `${body.role}-${Date.now()}`,
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      status: 'active',
      phone: body.phone,
      createdAt: now,
      updatedAt: now,
    };
    const user =
      body.role === 'alumni'
        ? enhanceUser({
            ...base,
            graduationYear: body.graduationYear,
            degree: body.degree,
            major: body.major,
            currentCompany: body.currentCompany,
            currentPosition: body.currentPosition,
            skills: [],
            experience: [],
            education: [],
            isAvailableForMentoring: true,
            mentorshipAreas: [],
          } as Alumni)
        : enhanceUser({
            ...base,
            enrollmentYear: body.enrollmentYear,
            expectedGraduation: body.expectedGraduation,
            major: body.major,
            interests: [],
          } as Student);
    db.users.push(user);
    saveDb(db);
    return ok({ message: 'Registration successful', user });
  }

  if (resource === 'auth' && id === 'logout') return ok({ message: 'Logged out successfully' });

  if (resource === 'users') {
    if (method === 'GET' && id) return ok(getUser(id));
    if (method === 'GET') return ok(db.users);
    if (method === 'PUT' && id) {
      const index = db.users.findIndex((u) => u.id === id);
      if (index < 0) return fail('User not found', 404);
      db.users[index] = enhanceUser({ ...db.users[index], ...body, updatedAt: new Date().toISOString() });
      saveDb(db);
      return ok(db.users[index]);
    }
    if (method === 'DELETE' && id) {
      db.users = db.users.filter((u) => u.id !== id);
      saveDb(db);
      return ok({ message: 'User deleted' });
    }
  }

  if (resource === 'alumni') {
    if (method === 'GET' && id) return ok(db.users.find((u) => u.id === id && u.role === 'alumni'));
    if (method === 'GET') {
      const available = url.searchParams.get('availableForMentoring') || url.searchParams.get('isAvailableForMentoring');
      let alumni = db.users.filter((u) => u.role === 'alumni') as Alumni[];
      if (available === 'true') alumni = alumni.filter((a) => a.availableForMentoring || a.isAvailableForMentoring);
      return ok(alumni);
    }
    if (method === 'PUT' && id) {
      const index = db.users.findIndex((u) => u.id === id && u.role === 'alumni');
      if (index < 0) return fail('Alumni not found', 404);
      const patch = {
        ...body,
        currentCompany: body.company ?? body.currentCompany,
        currentPosition: body.jobTitle ?? body.currentPosition,
        major: body.department ?? body.major,
        updatedAt: new Date().toISOString(),
      };
      db.users[index] = enhanceUser({ ...db.users[index], ...patch });
      saveDb(db);
      return ok(db.users[index]);
    }
  }

  if (resource === 'students') {
    if (method === 'GET' && id) return ok(db.users.find((u) => u.id === id && u.role === 'student'));
    if (method === 'GET') return ok(db.users.filter((u) => u.role === 'student'));
    if (method === 'PUT' && id) {
      const index = db.users.findIndex((u) => u.id === id && u.role === 'student');
      if (index < 0) return fail('Student not found', 404);
      db.users[index] = enhanceUser({ ...db.users[index], ...body, updatedAt: new Date().toISOString() });
      saveDb(db);
      return ok(db.users[index]);
    }
  }

  if (resource === 'jobs') {
    if (id && sub === 'applications') {
      if (method === 'GET') return ok(db.jobApplications.filter((a) => a.jobId === id));
      if (method === 'POST') {
        const app = { id: `app-${Date.now()}`, jobId: id, applicantId: body.applicantId, coverLetter: body.coverLetter, resumeUrl: body.resumeUrl, status: 'pending', appliedAt: new Date().toISOString() } as JobApplication;
        db.jobApplications.push(app);
        db.jobs = db.jobs.map((job) => (job.id === id ? enhanceJob({ ...job, applicationsCount: job.applicationsCount + 1 }) : job));
        saveDb(db);
        return ok(app);
      }
    }
    if (id && sub === 'save' && method === 'POST') {
      const userId = body.userId || 'guest';
      const existing = db.savedJobs.find((saved) => saved.jobId === id && saved.userId === userId);
      if (existing) return ok(existing);
      const saved = { id: `saved-${Date.now()}`, userId, jobId: id, savedAt: new Date().toISOString() };
      db.savedJobs.push(saved);
      saveDb(db);
      return ok(saved);
    }
    if (method === 'GET' && id) return ok(enhanceJob(db.jobs.find((job) => job.id === id)!));
    if (method === 'GET') return ok(db.jobs.map(enhanceJob));
    if (method === 'POST') {
      const job = enhanceJob(normalizeJob(body));
      db.jobs.unshift(job);
      saveDb(db);
      return ok(job);
    }
    if (method === 'PUT' && id) {
      const index = db.jobs.findIndex((job) => job.id === id);
      if (index < 0) return fail('Job not found', 404);
      db.jobs[index] = enhanceJob({ ...db.jobs[index], ...body, updatedAt: new Date().toISOString() });
      saveDb(db);
      return ok(db.jobs[index]);
    }
    if (method === 'DELETE' && id) {
      db.jobs = db.jobs.filter((job) => job.id !== id);
      saveDb(db);
      return ok({ message: 'Job deleted' });
    }
  }

  if (resource === 'events') {
    if (id && sub === 'registrations') {
      if (method === 'GET') return ok(db.eventRegistrations.filter((r) => r.eventId === id));
      if (method === 'POST') {
        const existing = db.eventRegistrations.find((r) => r.eventId === id && r.userId === body.userId);
        if (existing) return ok(existing);
        const reg = { id: `reg-${Date.now()}`, eventId: id, userId: body.userId, status: 'registered', registeredAt: new Date().toISOString() } as EventRegistration;
        db.eventRegistrations.push(reg);
        db.events = db.events.map((event) => (event.id === id ? enhanceEvent({ ...event, currentAttendees: event.currentAttendees + 1 }) : event));
        saveDb(db);
        return ok(reg);
      }
    }
    if (method === 'GET' && id) return ok(enhanceEvent(db.events.find((event) => event.id === id)!));
    if (method === 'GET') return ok(db.events.map(enhanceEvent));
    if (method === 'POST') {
      const event = enhanceEvent(normalizeEvent(body));
      db.events.unshift(event);
      saveDb(db);
      return ok(event);
    }
    if (method === 'PUT' && id) {
      const index = db.events.findIndex((event) => event.id === id);
      if (index < 0) return fail('Event not found', 404);
      db.events[index] = enhanceEvent({ ...db.events[index], ...body, updatedAt: new Date().toISOString() });
      saveDb(db);
      return ok(db.events[index]);
    }
    if (method === 'DELETE' && id) {
      db.events = db.events.filter((event) => event.id !== id);
      saveDb(db);
      return ok({ message: 'Event deleted' });
    }
  }

  if (resource === 'mentorship') {
    if (method === 'GET' && id) return ok(db.mentorships.find((m) => m.id === id));
    if (method === 'GET') {
      return ok(db.mentorships.map((m) => ({
        ...m,
        mentor: getUser(m.mentorId),
        mentee: getUser(m.menteeId),
        mentorName: getUser(m.mentorId)?.name,
        menteeName: getUser(m.menteeId)?.name,
      })));
    }
    if (method === 'POST') {
      const mentorship = stamp({
        id: `mentorship-${Date.now()}`,
        mentorId: body.mentorId,
        menteeId: body.menteeId,
        status: 'pending',
        topic: body.topic || 'Mentorship Request',
        message: body.message || '',
        goals: body.goals || [],
        sessionsCompleted: 0,
      } as MentorshipRequest);
      db.mentorships.unshift(mentorship);
      saveDb(db);
      return ok(mentorship);
    }
    if (method === 'PUT' && id) {
      const index = db.mentorships.findIndex((m) => m.id === id);
      if (index < 0) return fail('Mentorship request not found', 404);
      db.mentorships[index] = { ...db.mentorships[index], ...body, updatedAt: new Date().toISOString() };
      saveDb(db);
      return ok(db.mentorships[index]);
    }
  }

  if (resource === 'messages') {
    if (id === 'conversations' && method === 'POST') {
      const participants = body.participants || [];
      const existing = db.conversations.find((c) =>
        participants.length === c.participants.length && participants.every((p: string) => c.participants.includes(p))
      );
      if (existing) return ok(existing);
      const conversation = {
        id: `conv-${Date.now()}`,
        participants,
        type: 'direct',
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Conversation;
      db.conversations.unshift(conversation);
      saveDb(db);
      return ok(conversation);
    }
    if (id === 'conversations' && sub && path[3] === 'messages' && method === 'GET') {
      return ok(db.messages.filter((m) => m.conversationId === sub));
    }
    if (id === 'conversations' && method === 'GET' && sub) {
      const conversation = db.conversations.find((c) => c.id === sub);
      if (!conversation) return fail('Conversation not found', 404);
      return ok({ ...conversation, messages: db.messages.filter((m) => m.conversationId === sub) });
    }
    if (id === 'conversations' && method === 'GET') {
      return ok(db.conversations.map((conversation) => {
        const otherId = conversation.participants.find((p) => p !== url.searchParams.get('userId')) || conversation.participants[0];
        const other = getUser(otherId);
        return {
          ...conversation,
          participantUsers: conversation.participants.map(getUser).filter(Boolean),
          participantName: other?.name || conversation.name || 'Conversation',
          participantAvatar: other?.avatarUrl,
          lastMessage: typeof conversation.lastMessage === 'string' ? conversation.lastMessage : conversation.lastMessage?.content || '',
          lastMessageTime: typeof conversation.lastMessage === 'string' ? conversation.updatedAt : conversation.lastMessage?.createdAt || conversation.updatedAt,
          isOnline: false,
        };
      }));
    }
    if (method === 'POST') {
      const message = { id: `msg-${Date.now()}`, conversationId: body.conversationId, senderId: body.senderId, content: body.content, type: 'text', status: 'sent', createdAt: new Date().toISOString(), readBy: [body.senderId] } as Message;
      db.messages.push(message);
      db.conversations = db.conversations.map((c) => (c.id === body.conversationId ? { ...c, lastMessage: message, updatedAt: message.createdAt } : c));
      saveDb(db);
      return ok(message);
    }
  }

  if (resource === 'notifications') {
    if (id === 'mark-all-read' && method === 'POST') {
      const userId = url.searchParams.get('userId');
      db.notifications = db.notifications.map((n) => (!userId || n.userId === userId ? { ...n, isRead: true, read: true } : n));
      saveDb(db);
      return ok({ message: 'All notifications marked as read' });
    }
    if (method === 'GET') {
      const userId = url.searchParams.get('userId');
      return ok(db.notifications.filter((n) => !userId || n.userId === userId).map((n) => ({ ...n, read: n.isRead })));
    }
    if (method === 'PUT' && id) {
      const index = db.notifications.findIndex((n) => n.id === id);
      if (index < 0) return fail('Notification not found', 404);
      db.notifications[index] = { ...db.notifications[index], ...body, isRead: body.isRead ?? body.read ?? true, read: body.read ?? body.isRead ?? true };
      saveDb(db);
      return ok(db.notifications[index]);
    }
    if (method === 'DELETE' && id) {
      db.notifications = db.notifications.filter((n) => n.id !== id);
      saveDb(db);
      return ok({ message: 'Notification deleted' });
    }
  }

  if (resource === 'dashboard' && id === 'stats') {
    return ok({
      totalUsers: db.users.length,
      totalAlumni: db.users.filter((u) => u.role === 'alumni').length,
      totalStudents: db.users.filter((u) => u.role === 'student').length,
      activeJobs: db.jobs.filter((j) => j.status === 'open').length,
      upcomingEvents: db.events.filter((e) => e.status === 'upcoming').length,
      activeMentorships: db.mentorships.filter((m) => m.status === 'active').length,
      newUsersThisMonth: db.users.length,
      jobApplicationsThisMonth: db.jobApplications.length,
      eventRegistrationsThisMonth: db.eventRegistrations.length,
    });
  }

  return fail('Endpoint not found', 404);
}

export async function GET(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handle(request, await context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handle(request, await context.params);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handle(request, await context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handle(request, await context.params);
}
