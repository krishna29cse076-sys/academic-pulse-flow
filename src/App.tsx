import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/layout/DashboardLayout";
import Feed from "./pages/dashboard/Feed";
import Notes from "./pages/dashboard/Notes";
import Assignments from "./pages/dashboard/Assignments";
import Messages from "./pages/dashboard/Messages";
import Groups from "./pages/dashboard/Groups";
import Games from "./pages/dashboard/Games";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Help from "./pages/dashboard/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Feed />} />
            <Route path="notes" element={<Notes />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="groups" element={<Groups />} />
            <Route path="games" element={<Games />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
