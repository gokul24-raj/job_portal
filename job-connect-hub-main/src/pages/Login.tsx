import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

const demoAccounts = [
  { label: "Admin", email: "admin@vip.dev", password: "admin123" },
  { label: "Employer", email: "employer@vip.dev", password: "password" },
  { label: "Student", email: "student@vip.dev", password: "password" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok !== true) {
      setError(res.error);
      return;
    }
    toast.success("Welcome back!");
    navigate("/");
  };

  const useDemo = (acc: (typeof demoAccounts)[number]) => {
    const res = login(acc.email, acc.password);
    if (res.ok) {
      toast.success(`Signed in as ${acc.label}`);
      navigate("/");
    }
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
          <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase">Demo accounts</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((d) => (
              <Button key={d.email} variant="outline" size="sm" onClick={() => useDemo(d)}>
                {d.label}
              </Button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
