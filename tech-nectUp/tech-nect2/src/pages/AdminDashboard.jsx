import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getJobs, getGigs } from "../utils/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData() {
      try {
        const [userRes, jobRes, gigRes] = await Promise.all([
          getUsers(token),
          getJobs(token),
          getGigs(token),
        ]);
        setUsers(userRes);
        setJobs(jobRes);
        setGigs(gigRes);
      } catch (err) {
        toast.error("Failed to load admin data");
      }
    }

    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return <p className="p-10 text-red-500">Access denied. Admins only.</p>;
  }

  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-900">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 text-blue-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Total Users</div>
          <div className="text-3xl font-black">{users.length}</div>
        </div>
        <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Jobs Posted</div>
          <div className="text-3xl font-black">{jobs.length}</div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Total Gigs</div>
          <div className="text-3xl font-black">{gigs.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between border-b pb-2">
              <span>{u.name} ({u.email})</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
