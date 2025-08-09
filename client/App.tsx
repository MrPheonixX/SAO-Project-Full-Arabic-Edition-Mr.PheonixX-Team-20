import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Security provider will be added later
// import SecurityProvider from "./components/SecurityProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SAOLibrary from "./pages/SAOLibrary";
import SAOProgressiveLibrary from "./pages/SAOProgressiveLibrary";
import SideWorksLibrary from "./pages/SideWorksLibrary";
import BookReader from "./pages/BookReader";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sao" element={<SAOLibrary />} />
          <Route path="/progressive" element={<SAOProgressiveLibrary />} />
          <Route path="/sideworks" element={<SideWorksLibrary />} />
          <Route path="/reader/:series/:volumeId" element={<BookReader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-panel" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Robust root management for both dev and production
function initializeApp() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  // Check if we already have a root instance
  if (!(window as any).__SAO_REACT_ROOT__) {
    // Create new root and store globally
    const root = createRoot(container);
    (window as any).__SAO_REACT_ROOT__ = root;
    console.log("🛡️ SAO Arabic Reader - React root created");
  }

  // Always render with the existing root
  const root = (window as any).__SAO_REACT_ROOT__;
  root.render(<App />);
}

// Initialize the app
initializeApp();

// Handle hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // On hot reload, just re-render with existing root
    const root = (window as any).__SAO_REACT_ROOT__;
    if (root) {
      root.render(<App />);
    }
  });
}
