import { Briefcase, Building2, Search, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/storage";
import { useAuth } from "@/lib/auth";

export function Landing() {
  const { user } = useAuth();
  const featured = db.getJobs().slice(0, 3);

  const studentCta = user?.role === "student" ? "/jobs" : "/signup";
  const employerCta = user?.role === "employer" ? "/employer" : "/signup";

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Sparkles className="h-3 w-3" /> Connecting talent with opportunity
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Where students meet
            <span className="text-primary"> their next opportunity.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            VELLAI ILLATHA PATTATHARI makes it simple for students to find internships and full-time roles — and for employers to
            discover, review, and shortlist top candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to={studentCta}>
                <Search className="h-4 w-4" /> Find a job
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={employerCta}>
                <Building2 className="h-4 w-4" /> Hire talent
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl font-semibold mb-2">For Students</h2>
              <p className="text-muted-foreground mb-6">
                Build your profile, upload your resume, and apply to roles in one click. Track applications and get
                notified when employers shortlist you.
              </p>
              <Button asChild variant="secondary">
                <Link to={studentCta}>Browse jobs →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl font-semibold mb-2">For Employers</h2>
              <p className="text-muted-foreground mb-6">
                Post roles in minutes, review applicants with full profiles and resumes, and shortlist your favorites
                without juggling spreadsheets.
              </p>
              <Button asChild variant="secondary">
                <Link to={employerCta}>Post a job →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container pb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold">Featured roles</h2>
              <p className="text-muted-foreground mt-1">A small taste of what's open right now.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/jobs">View all →</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((j) => (
              <Card key={j.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">{j.company}</div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{j.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {j.skills.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{j.location}</span>
                    <Link to={`/jobs/${j.id}`} className="text-primary font-medium hover:underline">
                      View →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
