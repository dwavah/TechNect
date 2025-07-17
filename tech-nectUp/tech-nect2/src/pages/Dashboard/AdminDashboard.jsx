// src/pages/dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getUsers,
  getAllJobs,
  getAllGigs,
  deleteUser,
  deleteJob,
  deleteGig,
} from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const u = await getUsers(user.token);
        const j = await getAllJobs(user.token);
        const g = await getAllGigs(user.token);
        setUsers(u.data || []);
        setJobs(j.data || []);
        setGigs(g.data || []);
      } catch (err) {
        toast.error("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      if (type === "user") {
        await deleteUser(id, user.token);
        setUsers(users.filter(u => u.id !== id));
        toast.success("User deleted.");
      } else if (type === "job") {
        await deleteJob(id, user.token);
        setJobs(jobs.filter(j => j.id !== id && j._id !== id));
        toast.success("Job deleted.");
      } else if (type === "gig") {
        await deleteGig(id, user.token);
        setGigs(gigs.filter(g => g.id !== id && g._id !== id));
        toast.success("Gig deleted.");
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const exportCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(row => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 max-w-[70%] mx-auto">
        <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <div className="mx-auto w-full max-w-[70%] space-y-6">
          {/* Users Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-blue-800">Users</h2>
              <button
                onClick={() => exportCSV(users, "users.csv")}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
              >
                Export CSV
              </button>
            </div>
            <ul className="divide-y">
              {users.map(u => (
                <li key={u.id} className="py-2 flex justify-between items-center">
                  <span>{u.email} – {u.role}</span>
                  <button
                    onClick={() => handleDelete("user", u.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Jobs Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-green-800">Jobs</h2>
              <button
                onClick={() => exportCSV(jobs, "jobs.csv")}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
              >
                Export CSV
              </button>
            </div>
            <ul className="divide-y">
              {jobs.map(job => (
                <li key={job._id || job.id} className="py-2 flex justify-between items-center">
                  <span>{job.title} – {job.location}</span>
                  <button
                    onClick={() => handleDelete("job", job._id || job.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Gigs Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-purple-800">Gigs</h2>
              <button
                onClick={() => exportCSV(gigs, "gigs.csv")}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-500"
              >
                Export CSV
              </button>
            </div>
            <ul className="divide-y">
              {gigs.map(gig => (
                <li key={gig._id || gig.id} className="py-2 flex justify-between items-center">
                  <span>{gig.title} – {gig.location}</span>
                  <button
                    onClick={() => handleDelete("gig", gig._id || gig.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
