// src/pages/dashboard/StudentDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Student Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.email} 👋</h2>
        <p className="text-slate-700 mb-4">
          This is your student dashboard. Here you can explore job opportunities, view your applications, and manage your profile.
        </p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <button
            className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700"
            onClick={() => navigate("/applications")}
          >
            My Applications
          </button>
        </div>
      </div>
    </div>
  );
}
