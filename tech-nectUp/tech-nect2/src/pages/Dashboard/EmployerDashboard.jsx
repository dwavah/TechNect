// src/pages/EmployerDashboard.jsx
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

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs and gigs for this employer
  useEffect(() => {
    if (user?.token && user?._id) {
      setLoading(true);
      setError(null);
      Promise.all([
        axios
          .get(`http://localhost:5000/api/jobs?employerId=${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => ({ data: [], error: err })),
        axios
          .get(`http://localhost:5000/api/gigs?employerId=${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => ({ data: [], error: err })),
      ])
        .then(([jobsRes, gigsRes]) => {
          if (jobsRes.error || gigsRes.error) {
            setError("Failed to load your jobs or gigs. Please try again.");
            setJobs([]);
            setGigs([]);
          } else {
            // Accept array or { jobs: [] } or { gigs: [] }
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
          setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
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
      {/* NAVIGATION */}
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
        <NavLink to="/employer/jobs/post" className="flex items-center gap-2 text-yellow-900 hover:text-yellow-600">
          <PlusCircleIcon className="h-5 w-5" /> Post Job
        </NavLink>
        <NavLink to="/employer/gigs/post" className="flex items-center gap-2 text-green-900 hover:text-green-600">
          <PlusCircleIcon className="h-5 w-5" /> Post Gig
        </NavLink>
        <NavLink to="/employer/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-700">
          <UserGroupIcon className="h-5 w-5" /> Profile
        </NavLink>
      </nav>

      {/* GREETING & STATS */}
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2 text-yellow-900">Hello, {user?.name || "Employer"}!</h2>
        <div className="mb-4 text-yellow-700">Welcome back. Here’s a summary of your activity:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col items-center">
            <ChartBarIcon className="w-8 h-8 text-yellow-700 mb-2" />
            <div className="text-3xl font-extrabold">{jobs.length}</div>
            <div className="text-yellow-900 font-semibold">Jobs Posted</div>
          </div>
          <div className="bg-green-100 rounded-xl p-6 shadow flex flex-col items-center">
            <ChartBarIcon className="w-8 h-8 text-green-700 mb-2" />
            <div className="text-3xl font-extrabold">{gigs.length}</div>
            <div className="text-green-900 font-semibold">Gigs Posted</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-6 shadow flex flex-col items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-700 mb-2" />
            <div className="text-3xl font-extrabold">{applicantCount}</div>
            <div className="text-blue-900 font-semibold">Applicants</div>
          </div>
        </div>
      </section>

      {/* RECENT JOBS TABLE */}
      <section className="max-w-4xl mx-auto mb-12">
        <h3 className="text-xl font-bold mb-3 text-blue-900">Recent Jobs</h3>
        {jobs.length === 0 ? (
          <div className="text-gray-400 mb-6">No jobs posted yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Applicants</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="border-b last:border-none">
                    <td className="py-2 px-4">{job.title}</td>
                    <td className="py-2 px-4">{job.applicants?.length || 0}</td>
                    <td className="py-2 px-4">{job.status || "Open"}</td>
                    <td className="py-2 px-4">
                      <Link to={`/jobs/${job._id}`} className="text-blue-700 hover:underline">
                        View
                      </Link>
                      <Link to={`/employer/jobs/${job._id}/edit`} className="ml-2 text-yellow-700 hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RECENT GIGS TABLE */}
      <section className="max-w-4xl mx-auto mb-20">
        <h3 className="text-xl font-bold mb-3 text-green-900">Recent Gigs</h3>
        {gigs.length === 0 ? (
          <div className="text-gray-400 mb-6">No gigs posted yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-green-100 text-green-900">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Applicants</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {gigs.slice(0, 5).map((gig) => (
                  <tr key={gig._id} className="border-b last:border-none">
                    <td className="py-2 px-4">{gig.title}</td>
                    <td className="py-2 px-4">{gig.applicants?.length || 0}</td>
                    <td className="py-2 px-4">{gig.status || "Open"}</td>
                    <td className="py-2 px-4">
                      <Link to={`/gigs/${gig._id}`} className="text-blue-700 hover:underline">
                        View
                      </Link>
                      <Link to={`/employer/gigs/${gig._id}/edit`} className="ml-2 text-yellow-700 hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
