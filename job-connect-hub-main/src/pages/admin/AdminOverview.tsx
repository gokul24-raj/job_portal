import { useEffect, useState } from "react";
import { db } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Users } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export function AdminOverview() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  const users = db.getUsers();
  const jobs = db.getJobs();
  const apps = db.getApplications();

  const data = [
    { name: "Students", value: users.filter((u) => u.role === "student").length },
    { name: "Employers", value: users.filter((u) => u.role === "employer").length },
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
    { name: "Jobs", value: jobs.length },
    { name: "Apps", value: apps.length },
    { name: "Shortlisted", value: apps.filter((a) => a.status === "shortlisted").length },
  ];

  return (
    <div className="container py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Platform overview</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Kpi label="Total users" value={users.length} icon={Users} />
        <Kpi label="Active jobs" value={jobs.length} icon={Briefcase} />
        <Kpi label="Applications" value={apps.length} icon={FileText} />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Activity snapshot</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
