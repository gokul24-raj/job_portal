import { db, uid } from "./storage";
import type { Job, User } from "./types";

export function seedIfNeeded() {
  if (db.isSeeded()) return;

  const now = Date.now();
  const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

  const users: User[] = [
    {
      id: "u_admin",
      name: "Ava Admin",
      email: "admin@vip.dev",
      password: "admin123",
      role: "admin",
      createdAt: daysAgo(60),
    },
    {
      id: "u_emp1",
      name: "Evan Reyes",
      email: "employer@vip.dev",
      password: "password",
      role: "employer",
      company: "Northwind Labs",
      createdAt: daysAgo(45),
    },
    {
      id: "u_emp2",
      name: "Mira Patel",
      email: "mira@brightpath.io",
      password: "employer123",
      role: "employer",
      company: "Brightpath Studio",
      createdAt: daysAgo(30),
    },
    {
      id: "u_stu1",
      name: "Sam Student",
      email: "student@vip.dev",
      password: "password",
      role: "student",
      headline: "Final-year CS student • React & Node",
      location: "Bangalore, IN",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      experienceYears: 1,
      bio: "Passionate about building delightful web experiences. Looking for a frontend internship.",
      resume: null,
      createdAt: daysAgo(20),
    },
    {
      id: "u_stu2",
      name: "Lina Park",
      email: "lina@student.dev",
      password: "student123",
      role: "student",
      headline: "Data science enthusiast",
      location: "Seoul, KR",
      skills: ["Python", "Pandas", "SQL", "ML"],
      experienceYears: 0,
      bio: "Recent grad eager to learn from a strong data team.",
      resume: null,
      createdAt: daysAgo(10),
    },
  ];

  const jobs: Job[] = [
    {
      id: uid(),
      employerId: "u_emp1",
      company: "Northwind Labs",
      title: "Frontend Engineer Intern",
      description:
        "Join our product team to build modern UI features in React. You'll pair with senior engineers, ship to production weekly, and own end-to-end features.",
      category: "Engineering",
      location: "Remote",
      experience: "Entry",
      skills: ["React", "TypeScript", "CSS"],
      salaryMin: 1200,
      salaryMax: 1800,
      postedAt: daysAgo(2),
    },
    {
      id: uid(),
      employerId: "u_emp1",
      company: "Northwind Labs",
      title: "Backend Developer",
      description:
        "Design REST APIs, work with PostgreSQL, and help scale our platform. Spring Boot experience preferred.",
      category: "Engineering",
      location: "Bangalore, IN",
      experience: "Mid",
      skills: ["Java", "Spring Boot", "PostgreSQL"],
      salaryMin: 4000,
      salaryMax: 6500,
      postedAt: daysAgo(5),
    },
    {
      id: uid(),
      employerId: "u_emp2",
      company: "Brightpath Studio",
      title: "Product Designer",
      description: "Craft beautiful, accessible experiences across web and mobile. Strong Figma skills required.",
      category: "Design",
      location: "Remote",
      experience: "Mid",
      skills: ["Figma", "Design Systems", "Prototyping"],
      salaryMin: 3500,
      salaryMax: 5500,
      postedAt: daysAgo(7),
    },
    {
      id: uid(),
      employerId: "u_emp2",
      company: "Brightpath Studio",
      title: "Data Analyst Intern",
      description: "Turn raw data into stories. Build dashboards and partner with product to find insights.",
      category: "Data",
      location: "Seoul, KR",
      experience: "Entry",
      skills: ["SQL", "Python", "Tableau"],
      salaryMin: 1000,
      salaryMax: 1500,
      postedAt: daysAgo(1),
    },
  ];

  db.setUsers(users);
  db.setJobs(jobs);
  db.setApplications([]);
  db.setNotifications([]);
  db.markSeeded();
}
