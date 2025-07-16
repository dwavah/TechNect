// src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobById, applyToJob } from "../utils/api";
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
      const data = await getJobById(id, user.token);
      if (data?.success === false || !data) {
        toast.error("Could not load job.");
        setJob(null);
      } else {
        setJob(data);
      }
      setLoading(false);
    }
    fetchJob();
  }, [id, user.token]);

  const handleApply = async () => {
    const res = await applyToJob(id, user.token);
    if (res.success === false) {
      toast.error(res.message || "Application failed.");
    } else {
      toast.success("Application submitted!");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8 text-red-500">Job not found.</div>;

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <JobCard
        job={job}
        showApply={user?.role === "student"}
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
