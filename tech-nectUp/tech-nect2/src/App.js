import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../src/context/AuthContext.js";

import Home from "./pages/Home";
import Start from "./pages/Start";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Gigs from "./pages/Gigs";
import Upskill from "./pages/Upskill";
import NotFound from "./pages/NotFound";
import GetStarted from "./pages/GetStarted";

// Student
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import StudentProfile from "./pages/Profile/StudentProfile";
import Applications from "./pages/Applications.jsx";

// Employer
import EmployerDashboard from "./pages/Dashboard/EmployerDashboard.jsx";
import EmployerProfile from "./pages/Profile/EmployerProfile.jsx";
import EmployerJobs from "./pages/employer/MyJobs.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import EditJob from "./pages/employer/EditJob.jsx";
import EmployerGigs from "./pages/employer/EmployerGigs.jsx";
import PostGig from "./pages/employer/PostGig.jsx";

// Admin (optional)
import AdminDashboard from "./pages/AdminDashboard";

// ---- Route guards ----
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/start" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute role="student"><Applications /></ProtectedRoute>
          } />

          {/* Employer routes */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
          } />
          <Route path="/employer/profile" element={
            <ProtectedRoute role="employer"><EmployerProfile /></ProtectedRoute>
          } />
          <Route path="/employer/jobs" element={
            <ProtectedRoute role="employer"><EmployerJobs /></ProtectedRoute>
          } />
          <Route path="/employer/jobs/new" element={
            <ProtectedRoute role="employer"><PostJob /></ProtectedRoute>
          } />
          <Route path="/employer/jobs/:id/edit" element={
            <ProtectedRoute role="employer"><EditJob /></ProtectedRoute>
          } />
          <Route path="/employer/gigs" element={
            <ProtectedRoute role="employer"><EmployerGigs /></ProtectedRoute>
          } />
          <Route path="/employer/gigs/new" element={
            <ProtectedRoute role="employer"><PostGig /></ProtectedRoute>
          } />

          {/* Shared (protected) */}
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
          <Route path="/gigs" element={<ProtectedRoute><Gigs /></ProtectedRoute>} />
          <Route path="/upskill" element={<ProtectedRoute><Upskill /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
