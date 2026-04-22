import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, FileText, Upload, X } from "lucide-react";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [headline, setHeadline] = useState(user?.headline ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears ?? 0);
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setHeadline(user.headline ?? "");
    setLocation(user.location ?? "");
    setBio(user.bio ?? "");
    setExperienceYears(user.experienceYears ?? 0);
    setSkills(user.skills ?? []);
  }, [user]);

  if (!user) return null;

  const addSkill = () => {
    const t = skillInput.trim();
    if (!t || skills.includes(t)) return;
    setSkills([...skills, t]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  const onResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Resume must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ resume: { name: f.name, size: f.size, dataUrl: reader.result as string } });
      toast.success("Resume uploaded.");
    };
    reader.readAsDataURL(f);
  };

  const save = () => {
    updateProfile({ name, headline, location, bio, experienceYears, skills });
    toast.success("Profile saved.");
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-6">Your profile</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle>Basic info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Final-year CS student • React & Node"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of experience</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Add a skill and press Enter"
            />
            <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button onClick={() => removeSkill(s)} className="ml-1 rounded hover:bg-background/50 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
        <CardContent>
          {user.resume ? (
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">{user.resume.name}</div>
                  <div className="text-xs text-muted-foreground">{(user.resume.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={user.resume.dataUrl} download={user.resume.name}>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => updateProfile({ resume: null })}>
                  <X className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-md border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Click to upload resume</p>
              <p className="text-xs text-muted-foreground">PDF, DOC up to 2MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={onResume} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}>Save changes</Button>
      </div>
    </div>
  );
}
