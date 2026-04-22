import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Star, Users } from "lucide-react";

export function EmployerDashboard() {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  if (!user) return null;
  const jobs = db.getJobs().filter((j) => j.employerId === user.id);
  const jobIds = new Set(jobs.map((j) => j.id));
  const apps = db.getApplications().filter((a) => jobIds.has(a.jobId));
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your jobs.</p>
        </div>
        <Button asChild><Link to="/employer/post">Post a job</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Kpi label="Active jobs" value={jobs.length} icon={Briefcase} />
        <Kpi label="Total applicants" value={apps.length} icon={Users} />
        <Kpi label="Shortlisted" value={shortlisted} icon={Star} />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Recent activity</h2>
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet — post a job to get started.</p>
          ) : (
            <ul className="space-y-3">
              {apps.slice(0, 6).map((a) => {
                const j = jobs.find((x) => x.id === a.jobId);
                const stu = db.getUsers().find((u) => u.id === a.studentId);
                return (
                  <li key={a.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{stu?.name ?? "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">applied to {j?.title}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.appliedAt).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="font-heading text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
