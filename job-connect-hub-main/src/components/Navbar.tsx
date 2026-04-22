import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Briefcase, LogOut, Menu, Moon, Sun, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [, setTick] = useState(0);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", h);
    return () => window.removeEventListener("jc:storage", h);
  }, []);

  const notifications = user ? db.getNotifications().filter((n) => n.userId === user.id) : [];
  const unread = notifications.filter((n) => !n.read).length;

  const links = (() => {
    if (!user) return [];
    if (user.role === "student")
      return [
        { to: "/jobs", label: "Browse Jobs" },
        { to: "/applications", label: "My Applications" },
        { to: "/profile", label: "Profile" },
      ];
    if (user.role === "employer")
      return [
        { to: "/employer", label: "Dashboard" },
        { to: "/employer/jobs", label: "My Jobs" },
        { to: "/employer/post", label: "Post a Job" },
      ];
    return [
      { to: "/admin", label: "Overview" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/jobs", label: "Jobs" },
    ];
  })();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const markAllRead = () => {
    if (!user) return;
    const updated = db.getNotifications().map((n) => (n.userId === user.id ? { ...n, read: true } : n));
    db.setNotifications(updated);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden border border-border shadow-sm">
            <img src="/logo.png" alt="VIP Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-[#B8860B] to-[#DAA520] bg-clip-text text-transparent">
            VELLAI ILLATHA PATTATHARI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="bg-accent text-accent-foreground"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <>
              <DropdownMenu onOpenChange={(o) => o && markAllRead()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">No notifications yet.</div>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        onClick={() => n.link && navigate(n.link)}
                        className="flex flex-col items-start gap-1 py-2 cursor-pointer"
                      >
                        <span className="text-sm">{n.message}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium leading-none">{user.name}</span>
                      <Badge variant="secondary" className="mt-0.5 h-4 px-1.5 text-[10px] uppercase">
                        {user.role}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "student" && (
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserIcon className="mr-2 h-4 w-4" /> My profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button onClick={() => navigate("/signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>

      {mobileOpen && user && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container flex flex-col py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={cn("px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground")}
                activeClassName="bg-accent text-accent-foreground"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
