import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SecurityProvider from "./components/SecurityProvider";
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
  <SecurityProvider>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SecurityProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
