import type {
  Admin,
  Alumni,
  Student,
  Job,
  Event,
  MentorshipRequest,
  Conversation,
  Message,
  Notification,
  JobApplication,
  EventRegistration,
} from './types';

export const mockAlumni: Alumni[] = [];
export const mockStudents: Student[] = [];
export const mockAdmins: Admin[] = [];
export const mockJobs: Job[] = [];
export const mockEvents: Event[] = [];
export const mockMentorships: MentorshipRequest[] = [];
export const mockConversations: Conversation[] = [];
export const mockMessages: Message[] = [];
export const mockNotifications: Notification[] = [];
export const mockJobApplications: JobApplication[] = [];
export const mockEventRegistrations: EventRegistration[] = [];

export function getUserById() {
  return undefined;
}

export function getAllUsers() {
  return [];
}
