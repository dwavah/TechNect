import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerJobs } from "../../utils/api";
import JobCard from "../../components/JobCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployerJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const data = await getEmployerJobs(user.token);
      setJobs(Array.isArray(data) ? data : data.jobs || []);
      setLoading(false);
    }
    fetchJobs();
  }, [user.token]);

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-900">My Posted Jobs</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/employer/jobs/new")}
        >
          + Post New Job
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-slate-500">No jobs posted yet.</div>
      ) : (
        jobs.map(job => (
          <JobCard
            key={job._id || job.id}
            job={job}
            onClick={() => navigate(`/employer/jobs/${job._id || job.id}/edit`)}
          />
        ))
      )}
    </section>
  );
}
