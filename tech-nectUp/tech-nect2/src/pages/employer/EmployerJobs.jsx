import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerJobs, deleteJob } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployerJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      if (!user?.id && !user?._id) return;

      setLoading(true);
      try {
        const employerId = user._id || user.id;
        const data = await getEmployerJobs(employerId, user.token);
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (err) {
        toast.error("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id, user.token);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted.");
    } catch (err) {
      toast.error("Failed to delete job.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-800">My Jobs</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/employer/jobs/new")}
        >
          + Post Job
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-gray-500">You haven’t posted any jobs yet.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.status === "draft" ? (
                      <span className="text-yellow-600 font-medium">[Draft]</span>
                    ) : (
                      <span className="text-green-700">Published</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="text-blue-700 hover:underline"
                    onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
