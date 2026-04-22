import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

const statusVariant: Record<ApplicationStatus, { label: string; cls: string }> = {
  applied: { label: "Applied", cls: "bg-muted text-foreground" },
  shortlisted: { label: "Shortlisted", cls: "bg-success text-success-foreground" },
  rejected: { label: "Rejected", cls: "bg-destructive text-destructive-foreground" },
};

export function MyApplications() {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  if (!user) return null;
  const apps = db.getApplications().filter((a) => a.studentId === user.id);
  const jobs = db.getJobs();

  return (
    <div className="container py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">My applications</h1>

      {apps.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-heading text-lg font-semibold">No applications yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Browse jobs and apply with one click.</p>
            <Button asChild><Link to="/jobs">Browse jobs</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((a) => {
                  const j = jobs.find((x) => x.id === a.jobId);
                  const s = statusVariant[a.status];
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{j?.title ?? "Removed job"}</TableCell>
                      <TableCell className="text-muted-foreground">{j?.company ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(a.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={s.cls}>{s.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {j && (
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/jobs/${j.id}`}>View</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
