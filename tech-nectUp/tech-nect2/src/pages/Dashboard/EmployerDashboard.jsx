// src/pages/Dashboard/EmployerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, Link } from "react-router-dom";
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.token && user?._id) {
      console.log("✅ Starting fetch with user ID:", user._id);
      setLoading(true);
      setError(null);

      Promise.all([
        axios
          .get(`http://localhost:4000/api/jobs?employerId=${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => {
            console.error("❌ Jobs API failed:", err);
            return { data: [], error: err };
          }),
        axios
          .get(`http://localhost:4000/api/gigs?employerId=${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => {
            console.error("❌ Gigs API failed:", err);
            return { data: [], error: err };
          }),
      ])
        .then(([jobsRes, gigsRes]) => {
          console.log("✅ Jobs response:", jobsRes);
          console.log("✅ Gigs response:", gigsRes);

          if (jobsRes.error || gigsRes.error) {
            setError("Failed to load your jobs or gigs. Please try again.");
            setJobs([]);
            setGigs([]);
          } else {
            const jobsList = Array.isArray(jobsRes.data)
              ? jobsRes.data
              : jobsRes.data.jobs || [];

            const gigsList = Array.isArray(gigsRes.data)
              ? gigsRes.data
              : gigsRes.data.gigs || [];

            setJobs(jobsList);
            setGigs(gigsList);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Final catch error:", err);
          setError(err.message || "Unknown error");
          setLoading(false);
        });
    }
  }, [user]);

  const applicantCount = jobs?.reduce(
    (acc, job) => acc + (job.applicants?.length || 0),
    0
  );

  if (loading)
    return (
      <div className="p-8">
        <span className="text-blue-800">Loading your dashboard...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-700 font-semibold">
        {error}
        <br />
        <button
          className="mt-3 px-4 py-1 rounded bg-yellow-400 text-blue-900 hover:bg-yellow-300"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <Navbar />

      <nav className="flex flex-wrap gap-4 p-6 justify-center bg-white shadow rounded-b-xl mb-8">
        <NavLink to="/employer/dashboard" className="flex items-center gap-2 font-bold text-yellow-800 hover:text-yellow-600">
          <BriefcaseIcon className="h-5 w-5" /> Dashboard
        </NavLink>
        <NavLink to="/employer/jobs" className="flex items-center gap-2 text-blue-800 hover:text-blue-600">
          <ClipboardDocumentListIcon className="h-5 w-5" /> My Jobs
        </NavLink>
        <NavLink to="/employer/gigs" className="flex items-center gap-2 text-green-700 hover:text-green-500">
          <ClipboardDocumentListIcon className="h-5 w-5" /> My Gigs
        </NavLink>
        <NavLink to="/employer/jobs/new" className="flex items-center gap-2 text-yellow-900 hover:text-yellow-600">
          <PlusCircleIcon className="h-5 w-5" /> Post Job
        </NavLink>
        <NavLink to="/employer/gigs/new" className="flex items-center gap-2 text-green-900 hover:text-green-600">
          <PlusCircleIcon className="h-5 w-5" /> Post Gig
        </NavLink>
        <NavLink to="/employer/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
          <UserGroupIcon className="h-5 w-5" /> Profile
        </NavLink>
      </nav>
    </div>
  );
}
