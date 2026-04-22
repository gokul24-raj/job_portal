import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
import { db, uid } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  const job = db.getJobs().find((j) => j.id === id);
  if (!job) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Job not found.</p>
        <Button asChild variant="link"><Link to="/jobs">Back to jobs</Link></Button>
      </div>
    );
  }

  const applied = user
    ? db.getApplications().some((a) => a.jobId === job.id && a.studentId === user.id)
    : false;

  const apply = () => {
    if (!user) {
      toast.error("Please log in to apply.");
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      toast.error("Only students can apply to jobs.");
      return;
    }
    if (!user.resume) {
      toast.error("Please upload a resume on your profile first.");
      navigate("/profile");
      return;
    }
    db.upsertApplication({
      id: uid(),
      jobId: job.id,
      studentId: user.id,
      status: "applied",
      appliedAt: new Date().toISOString(),
    });
    db.pushNotification({
      id: uid(),
      userId: job.employerId,
      message: `${user.name} applied to "${job.title}"`,
      read: false,
      createdAt: new Date().toISOString(),
      link: `/employer/jobs/${job.id}/applicants`,
    });
    toast.success("Application submitted!");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/jobs"><ArrowLeft className="h-4 w-4" /> Back to jobs</Link>
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Badge variant="secondary" className="mb-2">{job.category}</Badge>
              <h1 className="font-heading text-3xl font-bold mb-1">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.company}</p>
            </div>
            <div className="hidden sm:block">
              {applied ? (
                <Button disabled variant="secondary">Already applied</Button>
              ) : (
                <Button onClick={apply}>Apply now</Button>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-3 my-6 pb-6 border-b border-border">
            <Stat icon={MapPin} label="Location" value={job.location} />
            <Stat icon={Briefcase} label="Experience" value={job.experience} />
            <Stat icon={DollarSign} label="Salary" value={`$${job.salaryMin}–${job.salaryMax}`} />
            <Stat icon={Calendar} label="Posted" value={new Date(job.postedAt).toLocaleDateString()} />
          </div>

          <div className="mb-6">
            <h2 className="font-heading text-lg font-semibold mb-2">About this role</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-heading text-lg font-semibold mb-2">Required skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="sm:hidden">
            {applied ? (
              <Button disabled variant="secondary" className="w-full">Already applied</Button>
            ) : (
              <Button onClick={apply} className="w-full">Apply now</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
