
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";
import EmployeeOnboarding from "./components/EmployeeOnboarding";
import InternalTools from "./components/InternalTools";
import EmployeeCalendar from "./components/EmployeeCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Layout><EmployeeDashboard /></Layout>} />
            <Route path="/calendar" element={<Layout><EmployeeCalendar /></Layout>} />
            <Route path="/holidays" element={<Layout><div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Holidays Page - Coming Soon</h1></div></Layout>} />
            <Route path="/tools" element={<Layout><InternalTools /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
            <Route path="/onboarding" element={<Layout><EmployeeOnboarding /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
