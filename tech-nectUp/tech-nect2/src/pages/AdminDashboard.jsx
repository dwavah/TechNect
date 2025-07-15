import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUsers,
  getJobs,
  getGigs,
  deleteUser,
  deleteJob,
  deleteGig,
} from "../utils/api";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";
import AdminHeader from "../components/AdminHeader";


export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedGigs, setSelectedGigs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [userRes, jobRes, gigRes] = await Promise.all([
        getUsers(token),
        getJobs(token),
        getGigs(token),
      ]);
      setUsers(userRes);
      setJobs(jobRes);
      setGigs(gigRes);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user?.role !== "admin") {
    return <p className="p-10 text-red-500">Access denied. Admins only.</p>;
  }

  const handleDelete = async (type, id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    try {
      if (type === "user") await deleteUser(id, token);
      if (type === "job") await deleteJob(id, token);
      if (type === "gig") await deleteGig(id, token);
      toast.success(`${type} deleted`);
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
  };

  const toggleSelect = (id, list, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkDelete = async (type, ids) => {
    const confirmed = window.confirm("Delete selected?");
    if (!confirmed) return;

    try {
      for (const id of ids) {
        if (type === "user") await deleteUser(id, token);
        if (type === "job") await deleteJob(id, token);
        if (type === "gig") await deleteGig(id, token);
      }
      toast.success("Bulk delete complete");
      fetchData();
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <AdminHeader title="Admin Dashboard" />

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

      {/* USER MANAGEMENT */}
      <div className="mb-10 bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between mb-2">
          <h3 className="text-xl font-semibold">Users</h3>
          <div className="space-x-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => bulkDelete("user", selectedUsers)}
            >
              Delete Selected
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => exportCSV(users, "users")}
            >
              Export CSV
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={() =>
                      toggleSelect(u.id, selectedUsers, setSelectedUsers)
                    }
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="space-x-2">
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete("user", u.id)}
                  >
                    Delete
                  </button>
                  <button className="text-sm text-blue-600">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JOBS */}
      <div className="mb-10 bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between mb-2">
          <h3 className="text-xl font-semibold">Jobs</h3>
          <div className="space-x-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => bulkDelete("job", selectedJobs)}
            >
              Delete Selected
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => exportCSV(jobs, "jobs")}
            >
              Export CSV
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th></th>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job.id)}
                    onChange={() =>
                      toggleSelect(job.id, selectedJobs, setSelectedJobs)
                    }
                  />
                </td>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td className="space-x-2">
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete("job", job.id)}
                  >
                    Delete
                  </button>
                  <button className="text-sm text-blue-600">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GIGS */}
      <div className="mb-10 bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between mb-2">
          <h3 className="text-xl font-semibold">Gigs</h3>
          <div className="space-x-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => bulkDelete("gig", selectedGigs)}
            >
              Delete Selected
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => exportCSV(gigs, "gigs")}
            >
              Export CSV
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map((gig) => (
              <tr key={gig.id} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedGigs.includes(gig.id)}
                    onChange={() =>
                      toggleSelect(gig.id, selectedGigs, setSelectedGigs)
                    }
                  />
                </td>
                <td>{gig.title}</td>
                <td>{gig.description.slice(0, 30)}...</td>
                <td>{gig.posted_by}</td>
                <td className="space-x-2">
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete("gig", gig.id)}
                  >
                    Delete
                  </button>
                  <button className="text-sm text-blue-600">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
