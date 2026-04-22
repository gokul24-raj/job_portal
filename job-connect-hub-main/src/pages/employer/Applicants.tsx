import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, uid } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Check, Download, FileText, X } from "lucide-react";
import { toast } from "sonner";
import type { ApplicationStatus } from "@/lib/types";

export function Applicants() {
  const { id } = useParams<{ id: string }>();
  const [, setTick] = useState(0);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  const job = db.getJobs().find((j) => j.id === id);
  if (!job) return <div className="container py-8">Job not found.</div>;

  const apps = db.getApplications().filter((a) => a.jobId === id);
  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const users = db.getUsers();

  const setStatus = (appId: string, studentId: string, status: ApplicationStatus) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;
    db.upsertApplication({ ...app, status });
    db.pushNotification({
      id: uid(),
      userId: studentId,
      message:
        status === "shortlisted"
          ? `You've been shortlisted for "${job.title}" 🎉`
          : `Your application for "${job.title}" was not selected.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/applications",
    });
    toast.success(status === "shortlisted" ? "Candidate shortlisted." : "Candidate rejected.");
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/employer/jobs"><ArrowLeft className="h-4 w-4" /> Back to jobs</Link>
      </Button>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground mt-1">{apps.length} applicants</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All ({apps.length})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({apps.filter((a) => a.status === "applied").length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({apps.filter((a) => a.status === "shortlisted").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({apps.filter((a) => a.status === "rejected").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No applicants in this view.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => {
            const stu = users.find((u) => u.id === a.studentId);
            if (!stu) return null;
            return (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                        {stu.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{stu.name}</div>
                        <div className="text-sm text-muted-foreground">{stu.headline ?? stu.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stu.location ?? "—"} · {stu.experienceYears ?? 0}y exp · Applied {new Date(a.appliedAt).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(stu.skills ?? []).slice(0, 5).map((s) => (
                            <Badge key={s} variant="outline">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={a.status} />
                      <div className="flex gap-2">
                        {stu.resume && (
                          <Button asChild variant="outline" size="sm">
                            <a href={stu.resume.dataUrl} download={stu.resume.name}>
                              <Download className="h-4 w-4" /> Resume
                            </a>
                          </Button>
                        )}
                        {a.status !== "shortlisted" && (
                          <Button size="sm" onClick={() => setStatus(a.id, stu.id, "shortlisted")}>
                            <Check className="h-4 w-4" /> Shortlist
                          </Button>
                        )}
                        {a.status !== "rejected" && (
                          <Button size="sm" variant="outline" onClick={() => setStatus(a.id, stu.id, "rejected")}>
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {stu.bio && (
                    <div className="mt-3 pt-3 border-t border-border flex items-start gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>{stu.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const map = {
    applied: { label: "Applied", cls: "bg-muted text-foreground" },
    shortlisted: { label: "Shortlisted", cls: "bg-success text-success-foreground" },
    rejected: { label: "Rejected", cls: "bg-destructive text-destructive-foreground" },
  } as const;
  const s = map[status];
  return <Badge className={s.cls}>{s.label}</Badge>;
}
