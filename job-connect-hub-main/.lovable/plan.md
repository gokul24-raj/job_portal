
# JobConnect — Frontend-Only Job Portal

A responsive web app connecting students, employers, and admins. All data persists in **localStorage** so posts, applications, and profiles survive refresh. Pre-seeded with demo jobs and users so it looks alive on first load.

## Design direction
- **Palette (Cloud White)**: bg `#fafbfc`, surfaces `#e8ecf1`, muted `#94a3b8`, primary `#3b82f6`. Light, professional SaaS feel reminiscent of LinkedIn.
- **Typography**: Space Grotesk for headings, DM Sans for body.
- **Style**: Generous whitespace, rounded cards (lg radius), subtle borders, soft shadows on hover, clean data tables.

## Auth & Roles (simulated)
- Login / Signup pages with role selector: **Student**, **Employer**, **Admin**.
- Session stored in localStorage; a top-right account menu with role badge and logout.
- Route guards redirect unauthorized roles to their own dashboard.
- Quick "demo account" buttons on login for fast review.

## Student experience
- **Profile page**: name, headline, location, skills (chip input), experience years, bio, resume upload (file stored as base64 in localStorage with name + size shown; download link).
- **Browse Jobs**: search bar + filters for category, location, experience level, salary range. Card grid with company, title, tags, posted date.
- **Job Detail**: full description, required skills, salary, "Apply" button (one-click using saved profile + resume).
- **My Applications**: table with job, employer, applied date, status badge (Applied / Shortlisted / Rejected).
- **Notifications**: bell icon with dropdown — fires when an employer shortlists/rejects you.

## Employer experience
- **Dashboard**: KPI cards (active jobs, total applicants, shortlisted), recent activity list.
- **Post a Job**: form with title, description, category, location, experience, skills (chips), salary range — validated.
- **My Jobs**: table with edit/delete actions and applicant count per job.
- **Applicants view** (per job): list of applicants with profile preview, resume download, and Shortlist / Reject buttons. Filter by status.

## Admin experience
- **Overview dashboard**: total users by role, total jobs, total applications, simple bar/line chart (recharts).
- **Manage Users**: table to view/disable accounts.
- **Manage Jobs**: table to view/remove any job listing across employers.

## Global
- Top navigation with role-aware links, notifications bell, account menu.
- Landing page with hero, "For Students / For Employers" split CTA, featured jobs preview, and login/signup buttons.
- Toast notifications for all actions (apply, post, shortlist, etc.).
- Fully responsive — mobile nav drawer, stacked cards, scrollable tables.
- Empty states and skeletons throughout.

## Data model (localStorage)
- `users[]` — id, name, email, password (plain, demo-only), role, profile fields, resume.
- `jobs[]` — id, employerId, title, description, category, location, experience, skills, salary, postedAt.
- `applications[]` — id, jobId, studentId, status, appliedAt.
- `notifications[]` — id, userId, message, read, createdAt.
- Seed file populates demo data on first load.

## Out of scope (frontend-only)
- Real backend, real email, real auth security. The UI mirrors the Spring Boot spec but uses local mock services so you can later swap in REST calls.
