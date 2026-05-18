import type {
  Alumni,
  Student,
  User,
  Job,
  Event,
  MentorshipRequest,
  Conversation,
  Message,
  Notification,
  JobApplication,
  EventRegistration,
  AuthResponse,
  ApiResponse,
  DashboardStats,
} from './types';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || payload.message || `Request failed with ${response.status}`);
  }

  return payload.data as T;
}

async function safeResponse<T>(call: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    return { success: true, data: await call() };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
  }
}

function currentUserId() {
  if (typeof window === 'undefined') return undefined;
  const stored = localStorage.getItem('auth_user');
  if (!stored) return undefined;
  try {
    return JSON.parse(stored).id as string;
  } catch {
    return undefined;
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      safeResponse<AuthResponse>(() =>
        request<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
      ),
    register: (data: Partial<User> & { password: string }) =>
      safeResponse<{ message: string; user: User }>(() =>
        request<{ message: string; user: User }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      ),
    logout: () => safeResponse<{ message: string }>(() => request('/auth/logout', { method: 'POST' })),
  },

  users: {
    getAll: () => request<User[]>('/users'),
    getById: (id: string) => request<User>(`/users/${id}`),
    update: (id: string, data: Partial<User>) =>
      request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
  },

  alumni: {
    getAll: () => request<Alumni[]>('/alumni'),
    getById: (id: string) => request<Alumni>(`/alumni/${id}`),
    getProfile: () => request<Alumni>(`/alumni/${currentUserId() || 'alumni-1'}`),
    update: (id: string, data: Partial<Alumni>) =>
      request<Alumni>(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateProfile: (data: Partial<Alumni>) =>
      request<Alumni>(`/alumni/${currentUserId() || 'alumni-1'}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getMentors: () => request<Alumni[]>('/alumni?availableForMentoring=true'),
  },

  students: {
    getAll: () => request<Student[]>('/students'),
    getById: (id: string) => request<Student>(`/students/${id}`),
    update: (id: string, data: Partial<Student>) =>
      request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  jobs: {
    getAll: () => request<Job[]>('/jobs'),
    getById: (id: string) => request<Job>(`/jobs/${id}`),
    create: (data: Partial<Job>) => request<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Job>) =>
      request<Job>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => request<{ message: string }>(`/jobs/${id}`, { method: 'DELETE' }),
    apply: (jobId: string, data: Partial<JobApplication> = {}) =>
      request<JobApplication>(`/jobs/${jobId}/applications`, {
        method: 'POST',
        body: JSON.stringify({ ...data, applicantId: data.applicantId || currentUserId() }),
      }),
    save: (jobId: string) =>
      request<{ id: string; userId: string; jobId: string; savedAt: string }>(`/jobs/${jobId}/save`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUserId() || 'guest' }),
      }),
    getApplications: (jobId: string) => request<JobApplication[]>(`/jobs/${jobId}/applications`),
  },

  events: {
    getAll: () => request<Event[]>('/events'),
    getById: (id: string) => request<Event>(`/events/${id}`),
    create: (data: Partial<Event>) => request<Event>('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Event>) =>
      request<Event>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string | number) => request<{ message: string }>(`/events/${id}`, { method: 'DELETE' }),
    register: (eventId: string, userId = currentUserId() || 'student-1') =>
      request<EventRegistration>(`/events/${eventId}/registrations`, {
        method: 'POST',
        body: JSON.stringify({ eventId, userId }),
      }),
    getRegistrations: (eventId: string) => request<EventRegistration[]>(`/events/${eventId}/registrations`),
  },

  mentorship: {
    getAll: () => request<MentorshipRequest[]>('/mentorship'),
    getRequests: () => request<MentorshipRequest[]>('/mentorship'),
    getById: (id: string) => request<MentorshipRequest>(`/mentorship/${id}`),
    create: (data: Partial<MentorshipRequest>) =>
      request<MentorshipRequest>('/mentorship', { method: 'POST', body: JSON.stringify(data) }),
    createRequest: (data: Partial<MentorshipRequest>) =>
      request<MentorshipRequest>('/mentorship', {
        method: 'POST',
        body: JSON.stringify({ ...data, menteeId: data.menteeId || currentUserId() || 'student-1' }),
      }),
    update: (id: string, data: Partial<MentorshipRequest>) =>
      request<MentorshipRequest>(`/mentorship/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  messages: {
    getConversations: () => request<Conversation[]>('/messages/conversations'),
    createConversation: (participantId: string) =>
      request<Conversation>('/messages/conversations', {
        method: 'POST',
        body: JSON.stringify({ participants: [currentUserId() || 'guest', participantId] }),
      }),
    getConversation: (id: string) => request<Conversation & { messages: Message[] }>(`/messages/conversations/${id}`),
    getMessages: (id: string) => request<Message[]>(`/messages/conversations/${id}/messages`),
    sendMessage: (conversationId: string, senderOrContent: string, maybeContent?: string) =>
      request<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          senderId: maybeContent ? senderOrContent : currentUserId() || 'student-1',
          content: maybeContent || senderOrContent,
        }),
      }),
  },

  notifications: {
    getAll: (userId = currentUserId()) => request<Notification[]>(`/notifications${userId ? `?userId=${userId}` : ''}`),
    markAsRead: (id: string) =>
      request<Notification>(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify({ isRead: true, read: true }) }),
    markAllAsRead: (userId = currentUserId() || '') =>
      request<{ message: string }>(`/notifications/mark-all-read?userId=${userId}`, { method: 'POST' }),
    delete: (id: string) => request<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),
  },

  dashboard: {
    getStats: () => safeResponse<DashboardStats>(() => request<DashboardStats>('/dashboard/stats')),
  },

  getJobs: () => request<Job[]>('/jobs'),
  createJob: (data: Partial<Job>) => request<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  deleteJob: (id: string | number) => request<{ message: string }>(`/jobs/${id}`, { method: 'DELETE' }),
  getEvents: () => request<Event[]>('/events'),
  createEvent: (data: Partial<Event>) => request<Event>('/events', { method: 'POST', body: JSON.stringify(data) }),
  deleteEvent: (id: string | number) => request<{ message: string }>(`/events/${id}`, { method: 'DELETE' }),
  getUsers: () => request<User[]>('/users'),
  getMentorshipRequests: () => request<MentorshipRequest[]>('/mentorship'),
  updateMentorshipRequest: (id: string, status: string) =>
    request<MentorshipRequest>(`/mentorship/${id}`, { method: 'PUT', body: JSON.stringify({ status: status.toLowerCase() }) }),
};
