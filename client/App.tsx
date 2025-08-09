import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
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

// Ensure we only create root once
const container = document.getElementById("root")!;
let root: any;

// Check if root already exists to prevent multiple createRoot calls
if (!(container as any)._reactRoot) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
} else {
  root = (container as any)._reactRoot;
}

root.render(<App />);
