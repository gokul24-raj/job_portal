import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { seedIfNeeded } from "@/lib/seed";
import { AppLayout } from "@/components/AppLayout";
import { RoleGuard } from "@/components/RoleGuard";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { BrowseJobs } from "@/pages/student/BrowseJobs";
import { JobDetail } from "@/pages/student/JobDetail";
import { Profile } from "@/pages/student/Profile";
import { MyApplications } from "@/pages/student/MyApplications";
import { EmployerDashboard } from "@/pages/employer/EmployerDashboard";
import { PostJob } from "@/pages/employer/PostJob";
import { MyJobs } from "@/pages/employer/MyJobs";
import { Applicants } from "@/pages/employer/Applicants";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { ManageUsers } from "@/pages/admin/ManageUsers";
import { ManageJobs } from "@/pages/admin/ManageJobs";
import NotFound from "./pages/NotFound.tsx";

seedIfNeeded();

const queryClient = new QueryClient();

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  if (user.role === "employer") return <Navigate to="/employer" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/jobs" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Student */}
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route
                path="/profile"
                element={<RoleGuard roles={["student"]}><Profile /></RoleGuard>}
              />
              <Route
                path="/applications"
                element={<RoleGuard roles={["student"]}><MyApplications /></RoleGuard>}
              />

              {/* Employer */}
              <Route
                path="/employer"
                element={<RoleGuard roles={["employer"]}><EmployerDashboard /></RoleGuard>}
              />
              <Route
                path="/employer/jobs"
                element={<RoleGuard roles={["employer"]}><MyJobs /></RoleGuard>}
              />
              <Route
                path="/employer/post"
                element={<RoleGuard roles={["employer"]}><PostJob mode="create" /></RoleGuard>}
              />
              <Route
                path="/employer/jobs/:id/edit"
                element={<RoleGuard roles={["employer"]}><PostJob mode="edit" /></RoleGuard>}
              />
              <Route
                path="/employer/jobs/:id/applicants"
                element={<RoleGuard roles={["employer"]}><Applicants /></RoleGuard>}
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={<RoleGuard roles={["admin"]}><AdminOverview /></RoleGuard>}
              />
              <Route
                path="/admin/users"
                element={<RoleGuard roles={["admin"]}><ManageUsers /></RoleGuard>}
              />
              <Route
                path="/admin/jobs"
                element={<RoleGuard roles={["admin"]}><ManageJobs /></RoleGuard>}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
