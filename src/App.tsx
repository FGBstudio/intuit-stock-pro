import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Inventory from "./pages/Inventory";
import SupplierOrders from "./pages/SupplierOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? (role === "PM" ? <Navigate to="/projects" replace /> : <Navigate to="/" replace />) : <Login />} />
      
      {/* Admin routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Index /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Inventory /></ProtectedRoute>} />
      <Route path="/supplier-orders" element={<ProtectedRoute allowedRoles={["ADMIN"]}><SupplierOrders /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Settings /></ProtectedRoute>} />
      
      {/* Shared route: both ADMIN and PM */}
      <Route path="/projects" element={<ProtectedRoute allowedRoles={["ADMIN", "PM"]}><Projects /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/intuit-stock-pro">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
