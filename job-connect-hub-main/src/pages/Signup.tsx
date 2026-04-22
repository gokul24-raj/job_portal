import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import type { Role } from "@/lib/types";
import { Briefcase } from "lucide-react";

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const res = signup({ name, email, password, role, company: role === "employer" ? company : undefined });
    if (res.ok !== true) {
      setError(res.error);
      return;
    }
    toast.success("Account created — welcome!");
    navigate("/");
  };

  return (
    <div className="container py-12 max-w-md">
      <div className="flex justify-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden border border-border bg-card shadow-sm">
          <img src="/logo.png" alt="VIP Logo" className="h-full w-full object-cover" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
          <CardDescription>Join VELLAI ILLATHA PATTATHARI in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>I am a...</Label>
              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as Role)}
                className="grid grid-cols-3 gap-2"
              >
                {(["student", "employer", "admin"] as Role[]).map((r) => (
                  <Label
                    key={r}
                    htmlFor={`role-${r}`}
                    className="flex items-center justify-center gap-2 rounded-md border border-input p-2.5 cursor-pointer hover:bg-muted has-[:checked]:bg-accent has-[:checked]:border-primary has-[:checked]:text-accent-foreground capitalize"
                  >
                    <RadioGroupItem id={`role-${r}`} value={r} className="sr-only" />
                    {r}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {role === "employer" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have one?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
