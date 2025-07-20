import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Employer Dashboard</h1>
          <p className="text-slate-700 mb-6">
            Welcome, <strong>{user?.email}</strong>. Manage your gigs and job posts here. You can also view applications submitted by students.
          </p>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <button
              className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700"
              onClick={() => navigate("/employer/jobs/new")}
            >
              Post a Job
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700"
              onClick={() => navigate("/employer/gigs/new")}
            >
              Post a Gig
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
              onClick={() => navigate("/employer/jobs")}
            >
              View My Jobs
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700"
              onClick={() => navigate("/employer/gigs")}
            >
              View My Gigs
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
