export type Role = 'admin' | 'user';

export type Action =
  | 'view_deadline'
  | 'mark_completed'
  | 'create_deadline'
  | 'delete_deadline';

export type UserRoleOrGuest = Role | 'guest';

export interface Subject {
  slug: string;
  code: string;
  name: string;
  credits: number;
  teacher: string;
  room: string;
  description: string;
  color: string;
  badge: string;
}

export type DeadlineType = 'assignment' | 'project' | 'lab' | 'exam';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  dueDate: string; // ISO string
  type: DeadlineType;
  submissionLink?: string;
  priority?: PriorityLevel;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
}

export interface CompletionRecord {
  [userEmail: string]: string[]; // array of deadline IDs
}
