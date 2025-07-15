import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerJobs, deleteJob } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployerJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await getEmployerJobs(user.token);
        const jobList = Array.isArray(data) ? data : data.jobs || [];
        setJobs(jobList);
      } catch (err) {
        toast.error("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    }
    if (user?.token) fetchJobs();
  }, [user.token]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await deleteJob(id, user.token);
      setJobs(jobs.filter((job) => job._id !== id));
      toast.success("Job deleted.");
    } catch (err) {
      toast.error("Failed to delete job.");
    }
  };

  const filteredJobs =
    statusFilter === "all"
      ? jobs
      : jobs.filter((job) => (job.status || "open").toLowerCase() === statusFilter);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-900">My Posted Jobs</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/employer/jobs/new")}
        >
          + Post New Job
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-gray-500">No jobs found.</div>
      ) : (
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <div
              key={job._id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-1">Status: {job.status || "open"}</p>
                <p className="text-sm text-gray-500">Applicants: {job.applicants?.length || 0}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                  className="text-sm text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
