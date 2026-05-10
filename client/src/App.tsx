import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Employees from "./pages/Employees";
import Trainers from "./pages/Trainers";
import Batches from "./pages/Batches";
import Tasks from "./pages/Tasks";
import DailyReports from "./pages/DailyReports";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Recruitment from "./pages/Recruitment";
import Interviews from "./pages/Interviews";
import Performance from "./pages/Performance";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Attendance from "./pages/Attendance";
import FooterPage from "./pages/FooterPage";
import Students from "./pages/Students";
import Interns from "./pages/Interns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Auth />;
}

function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<GuestRoute />} />
    <Route path="/auth" element={<AuthRoute />} />
    <Route path="/info/:slug" element={<FooterPage />} />
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/batches" element={<Batches />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/daily-reports" element={<DailyReports />} />
      <Route path="/leave" element={<Leave />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/recruitment" element={<Recruitment />} />
      <Route path="/interviews" element={<Interviews />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/students" element={<Students />} />
      <Route path="/interns" element={<Interns />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
