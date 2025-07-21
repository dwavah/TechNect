// src/pages/Upskill.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getJobs, getGigs } from "../utils/api";
import JobCard from "../components/JobCard";
import GigCard from "../components/GigCard";
import Navbar from "../components/Navbar";

export default function UpSkill() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const jobData = await getJobs(user?.token);
        const gigData = await getGigs(user?.token);
        setJobs(jobData || []);
        setGigs(gigData || []);
      } catch (err) {
        console.error("Error loading jobs and gigs:", err);
      }
    }
    fetchData();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Upskill Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Jobs */}
          <div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Jobs</h3>
            {jobs.length ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>

          {/* Right Column: Gigs */}
          <div>
            <h3 className="text-xl font-bold mb-2 text-green-700">Gigs</h3>
            {gigs.length ? (
              gigs.map((gig) => <GigCard key={gig.id} gig={gig} />)
            ) : (
              <p className="text-gray-500">No gigs found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
