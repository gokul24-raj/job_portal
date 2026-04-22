import type { Application, Job, Notification, User } from "./types";

const KEYS = {
  users: "jc_users",
  jobs: "jc_jobs",
  applications: "jc_applications",
  notifications: "jc_notifications",
  session: "jc_session",
  seeded: "jc_seeded_v2",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("jc:storage", { detail: { key } }));
}

export const db = {
  // Users
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),
  upsertUser: (u: User) => {
    const list = db.getUsers();
    const i = list.findIndex((x) => x.id === u.id);
    if (i >= 0) list[i] = u;
    else list.push(u);
    db.setUsers(list);
  },
  removeUser: (id: string) => db.setUsers(db.getUsers().filter((u) => u.id !== id)),

  // Jobs
  getJobs: () => read<Job[]>(KEYS.jobs, []),
  setJobs: (j: Job[]) => write(KEYS.jobs, j),
  upsertJob: (j: Job) => {
    const list = db.getJobs();
    const i = list.findIndex((x) => x.id === j.id);
    if (i >= 0) list[i] = j;
    else list.unshift(j);
    db.setJobs(list);
  },
  removeJob: (id: string) => {
    db.setJobs(db.getJobs().filter((j) => j.id !== id));
    db.setApplications(db.getApplications().filter((a) => a.jobId !== id));
  },

  // Applications
  getApplications: () => read<Application[]>(KEYS.applications, []),
  setApplications: (a: Application[]) => write(KEYS.applications, a),
  upsertApplication: (a: Application) => {
    const list = db.getApplications();
    const i = list.findIndex((x) => x.id === a.id);
    if (i >= 0) list[i] = a;
    else list.unshift(a);
    db.setApplications(list);
  },

  // Notifications
  getNotifications: () => read<Notification[]>(KEYS.notifications, []),
  setNotifications: (n: Notification[]) => write(KEYS.notifications, n),
  pushNotification: (n: Notification) => {
    const list = db.getNotifications();
    list.unshift(n);
    db.setNotifications(list);
  },

  // Session
  getSessionId: () => read<string | null>(KEYS.session, null),
  setSessionId: (id: string | null) => write(KEYS.session, id),

  isSeeded: () => read<boolean>(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
