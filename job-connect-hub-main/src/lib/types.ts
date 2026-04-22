export type Role = "student" | "employer" | "admin";

export type ApplicationStatus = "applied" | "shortlisted" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only
  role: Role;
  disabled?: boolean;
  // student fields
  headline?: string;
  location?: string;
  skills?: string[];
  experienceYears?: number;
  bio?: string;
  resume?: { name: string; size: number; dataUrl: string } | null;
  // employer fields
  company?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  employerId: string;
  company: string;
  title: string;
  description: string;
  category: string;
  location: string;
  experience: "Entry" | "Mid" | "Senior";
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
