// AlumniConnect Type Definitions
// Designed to match Java Spring Boot backend with MySQL database

export type UserRole = 'admin' | 'alumni' | 'student';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote' | 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'REMOTE';
export type JobStatus = 'open' | 'closed' | 'filled';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type MentorshipStatus = 'pending' | 'active' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface Alumni extends User {
  graduationYear: number;
  degree: string;
  major: string;
  currentCompany?: string;
  currentPosition?: string;
  industry?: string;
  location?: string;
  linkedinUrl?: string;
  bio?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  isAvailableForMentoring: boolean;
  mentorshipAreas: string[];
  userId?: string;
  company?: string;
  jobTitle?: string;
  department?: string;
  availableForMentoring?: boolean;
}

export interface Student extends User {
  enrollmentYear: number;
  expectedGraduation: number;
  major: string;
  gpa?: number;
  interests: string[];
  resumeUrl?: string;
  portfolioUrl?: string;
  department?: string;
}

export interface Admin extends User {
  department: string;
  permissions: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  gpa?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedBy: string;
  postedByUser?: Alumni;
  applicationDeadline?: string;
  applicationsCount: number;
  postedAt?: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  job?: Job;
  applicantId: string;
  applicant?: Student | Alumni;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  feedback?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'networking' | 'workshop' | 'seminar' | 'reunion' | 'career-fair' | 'webinar' | 'social';
  status: EventStatus;
  startDate: string;
  endDate: string;
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  maxAttendees?: number;
  currentAttendees: number;
  date?: string;
  attendees?: number;
  eventType?: 'NETWORKING' | 'WORKSHOP' | 'SEMINAR' | 'REUNION' | 'CAREER_FAIR' | 'WEBINAR' | 'OTHER';
  isRegistered?: boolean;
  registrationDeadline?: string;
  organizer: string;
  organizerUser?: User;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: User;
  status: 'registered' | 'attended' | 'cancelled' | 'no-show';
  registeredAt: string;
  attendedAt?: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentor?: Alumni;
  menteeId: string;
  mentee?: Student;
  status: MentorshipStatus;
  topic: string;
  message: string;
  goals: string[];
  topics?: string[];
  preferredSchedule?: string;
  startDate?: string;
  endDate?: string;
  sessionsCompleted: number;
  mentorName?: string;
  menteeName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  mentorship?: MentorshipRequest;
  scheduledAt: string;
  duration: number;
  topic: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantUsers?: User[];
  type: 'direct' | 'group';
  name?: string;
  lastMessage?: Message | string;
  participantName?: string;
  participantAvatar?: string;
  isOnline?: boolean;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  status: MessageStatus;
  createdAt: string;
  readBy: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job' | 'event' | 'mentorship' | 'message' | 'system' | 'application';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
}

export type AlumniProfile = Alumni;

export interface DashboardStats {
  totalUsers: number;
  totalAlumni: number;
  totalStudents: number;
  activeJobs: number;
  upcomingEvents: number;
  activeMentorships: number;
  newUsersThisMonth: number;
  jobApplicationsThisMonth: number;
  eventRegistrationsThisMonth: number;
}

export interface AlumniStats {
  jobsPosted: number;
  eventsAttended: number;
  menteeCount: number;
  connectionsCount: number;
  profileViews: number;
}

export interface StudentStats {
  applicationsSubmitted: number;
  eventsRegistered: number;
  mentorshipRequests: number;
  profileCompletion: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Filter Types
export interface JobFilters {
  search?: string;
  type?: JobType[];
  location?: string;
  status?: JobStatus;
  postedAfter?: string;
  postedBefore?: string;
}

export interface EventFilters {
  search?: string;
  type?: Event['type'][];
  status?: EventStatus;
  startAfter?: string;
  startBefore?: string;
  isVirtual?: boolean;
}

export interface AlumniFilters {
  search?: string;
  graduationYear?: number[];
  major?: string[];
  industry?: string[];
  location?: string;
  isAvailableForMentoring?: boolean;
  skills?: string[];
}
