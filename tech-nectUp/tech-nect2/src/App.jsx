// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import EmployerDashboard from "./pages/Dashboard/EmployerDashboard";

// ✨ Employer Pages
import PostJob from "./pages/employer/PostJob";
import PostGig from "./pages/employer/PostGig";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerGigs from "./pages/employer/EmployerGigs";
import EditJob from "./pages/employer/EditJob";
import EditGig from "./pages/employer/EditGig";

// ✨ Student Pages
import JobList from "./pages/student/JobList";
import MyApplications from "./pages/student/MyApplications";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="student">
              <JobList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute role="student">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Employer */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/new"
          element={
            <ProtectedRoute role="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/gigs/new"
          element={
            <ProtectedRoute role="employer">
              <PostGig />
            </ProtectedRoute>
          }
        />
        <Route path="/employer/gigs/new" element={<PostGig />} />
        <Route path="/employer/gigs/:id/edit" element={<EditGig />} />

        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute role="employer">
              <EmployerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/gigs"
          element={
            <ProtectedRoute role="employer">
              <EmployerGigs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:id/edit"
          element={
            <ProtectedRoute role="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/gigs/:id/edit"
          element={
            <ProtectedRoute role="employer">
              <EditGig />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
