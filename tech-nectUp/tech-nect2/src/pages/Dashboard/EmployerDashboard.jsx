// src/pages/dashboard/EmployerDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Employer Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.email}</h2>
        <p className="text-slate-700 mb-4">
          Manage your gigs and job posts from here. You can also view applications submitted by students.
        </p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <button
            className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700"
            onClick={() => navigate("/post-job")}
          >
            Post a Job
          </button>
          <button
            className="bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700"
            onClick={() => navigate("/post-gig")}
          >
            Post a Gig
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-3 rounded hover:bg-sky-700"
            onClick={() => navigate("/employer-jobs")}
          >
            View My Jobs
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700"
            onClick={() => navigate("/employer-gigs")}
          >
            View My Gigs
          </button>
        </div>
      </div>
    </div>
  );
}
