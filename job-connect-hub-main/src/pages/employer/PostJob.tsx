import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { db, uid } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { Job } from "@/lib/types";

interface Props {
  mode: "create" | "edit";
}

export function PostJob({ mode }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const existing: Job | undefined =
    mode === "edit" ? db.getJobs().find((j) => j.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState(existing?.category ?? "Engineering");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [experience, setExperience] = useState<Job["experience"]>(existing?.experience ?? "Entry");
  const [skills, setSkills] = useState<string[]>(existing?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [salaryMin, setSalaryMin] = useState(existing?.salaryMin ?? 1000);
  const [salaryMax, setSalaryMax] = useState(existing?.salaryMax ?? 3000);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && !existing) {
      toast.error("Job not found");
      navigate("/employer/jobs");
    }
  }, [mode, existing, navigate]);

  if (!user) return null;

  const addSkill = () => {
    const t = skillInput.trim();
    if (!t || skills.includes(t)) return;
    setSkills([...skills, t]);
    setSkillInput("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) return setError("Title must be at least 3 characters.");
    if (description.trim().length < 20) return setError("Description must be at least 20 characters.");
    if (!location.trim()) return setError("Location is required.");
    if (skills.length === 0) return setError("Add at least one skill.");
    if (salaryMin > salaryMax) return setError("Min salary cannot exceed max.");

    const job: Job = {
      id: existing?.id ?? uid(),
      employerId: user.id,
      company: user.company ?? user.name,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      experience,
      skills,
      salaryMin,
      salaryMax,
      postedAt: existing?.postedAt ?? new Date().toISOString(),
    };
    db.upsertJob(job);
    toast.success(mode === "create" ? "Job posted!" : "Job updated.");
    navigate("/employer/jobs");
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-6">
        {mode === "create" ? "Post a new job" : "Edit job"}
      </h1>

      <form onSubmit={submit}>
        <Card className="mb-6">
          <CardHeader><CardTitle>Job details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will the candidate do? What's the team like?"
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Engineering", "Design", "Data", "Marketing", "Product", "Operations"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc">Location</Label>
                <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Experience level</Label>
                <Select value={experience} onValueChange={(v) => setExperience(v as Job["experience"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="smin">Salary min ($)</Label>
                  <Input id="smin" type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smax">Salary max ($)</Label>
                  <Input id="smax" type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle>Required skills</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                }}
                placeholder="e.g. React"
              />
              <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="ml-1 p-0.5 rounded hover:bg-background/50">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate("/employer/jobs")}>Cancel</Button>
          <Button type="submit">{mode === "create" ? "Publish job" : "Save changes"}</Button>
        </div>
      </form>
    </div>
  );
}
