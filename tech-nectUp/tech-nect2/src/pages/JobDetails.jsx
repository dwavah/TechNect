import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../utils/api";
import JobCard from "../components/JobCard";
import toast from "react-hot-toast";

export default function JobDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      const data = await getJobs(user.token);
      const allJobs = Array.isArray(data) ? data : data.jobs || [];
      setJob(allJobs.find(j => (j._id || j.id) === id));
      setLoading(false);
    }
    fetchJob();
  }, [id, user.token]);

  const handleApply = async () => {
    // Call API to apply (not implemented in api.js, just toast for demo)
    toast.success("Application submitted! (Backend integration needed)");
    // Example:
    // await applyToJob(id, user.token)
    //   .then(() => toast.success("Applied!"))
    //   .catch(() => toast.error("Error applying"));
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8 text-red-500">Job not found.</div>;

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <JobCard
        job={job}
        showApply={user.role === "student"}
        onApply={handleApply}
      />
      <button
        className="mt-6 bg-blue-200 text-blue-900 px-4 py-2 rounded hover:bg-blue-100"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </section>
  );
}
