import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllJobs } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const data = await getAllJobs(user.token);
        const publishedJobs = Array.isArray(data)
          ? data.filter((job) => job.status === "published")
          : [];
        setJobs(publishedJobs);
      } catch (err) {
        toast.error("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.token) fetchJobs();
  }, [user]);

  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Available Jobs</h2>

      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-gray-500">No published jobs available.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
