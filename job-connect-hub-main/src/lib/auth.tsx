import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { db, uid } from "./storage";
import type { Role, User } from "./types";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    company?: string;
  }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  loginAs: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => db.getSessionId());
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("jc:storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("jc:storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const user = useMemo(() => {
    if (!userId) return null;
    return db.getUsers().find((u) => u.id === userId) ?? null;
  }, [userId]);

  const login: AuthContextValue["login"] = useCallback((email, password) => {
    const u = db.getUsers().find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, error: "No account found with that email." };
    if (u.disabled) return { ok: false, error: "This account has been disabled." };
    if (u.password !== password) return { ok: false, error: "Incorrect password." };
    db.setSessionId(u.id);
    setUserId(u.id);
    return { ok: true };
  }, []);

  const signup: AuthContextValue["signup"] = useCallback((data) => {
    const exists = db.getUsers().some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { ok: false, error: "An account with that email already exists." };
    const newUser: User = {
      id: uid(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      company: data.company,
      skills: [],
      createdAt: new Date().toISOString(),
    };
    db.upsertUser(newUser);
    db.setSessionId(newUser.id);
    setUserId(newUser.id);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    db.setSessionId(null);
    setUserId(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      db.upsertUser({ ...user, ...patch });
      setTick((t) => t + 1);
    },
    [user],
  );

  const loginAs = useCallback((id: string) => {
    db.setSessionId(id);
    setUserId(id);
  }, []);

  const value: AuthContextValue = { user, login, signup, logout, updateProfile, loginAs };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
