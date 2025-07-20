// src/pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../utils/api";
import JobCard from "../components/JobCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const data = await getJobs(user.token);
        const jobList = Array.isArray(data) ? data : data.jobs || [];

        console.log("Jobs fetched:", jobList);

        // ✅ Filter only jobs that have basic required info
        const filtered = jobList.filter(j => j.title && j.company);
        setJobs(filtered);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
      setLoading(false);
    }
    fetchJobs();
  }, [user.token]);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      (j.company && j.company.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">Available Jobs</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs..."
          className="w-full mb-6 px-4 py-2 rounded border focus:ring-2 focus:ring-blue-300"
        />
        {loading ? (
          <div>Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-slate-500">No jobs found.</div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id || job.id}
              job={job}
              onClick={() => navigate(`/jobs/${job._id || job.id}`)}
            />
          ))
        )}
      </section>
    </>
  );
}
