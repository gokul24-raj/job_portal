import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Search } from "lucide-react";
import { db } from "@/lib/storage";
import type { Job } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [experience, setExperience] = useState("all");

  useEffect(() => {
    const refresh = () => setJobs(db.getJobs());
    refresh();
    window.addEventListener("jc:storage", refresh);
    return () => window.removeEventListener("jc:storage", refresh);
  }, []);

  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))), [jobs]);
  const locations = useMemo(() => Array.from(new Set(jobs.map((j) => j.location))), [jobs]);

  const filtered = jobs.filter((j) => {
    if (q) {
      const s = q.toLowerCase();
      if (
        !j.title.toLowerCase().includes(s) &&
        !j.company.toLowerCase().includes(s) &&
        !j.skills.some((sk) => sk.toLowerCase().includes(s))
      )
        return false;
    }
    if (category !== "all" && j.category !== category) return false;
    if (location !== "all" && j.location !== location) return false;
    if (experience !== "all" && j.experience !== experience) return false;
    return true;
  });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Browse jobs</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} open roles</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Title, company, skill..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Entry">Entry</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-heading text-lg font-semibold">No jobs match your filters</h3>
            <p className="text-muted-foreground text-sm">Try clearing some filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((j) => (
            <Link to={`/jobs/${j.id}`} key={j.id}>
              <Card className="card-hover h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{j.category}</Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(j.postedAt)}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-1">{j.title}</h3>
                  <div className="text-sm text-muted-foreground mb-3">{j.company}</div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {j.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {j.location}
                    </span>
                    <span className="font-medium">${j.salaryMin}–${j.salaryMax}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
