// src/pages/UpSkill.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAIRecommendations } from "../utils/api"; // new function you’ll create
import Navbar from "../components/Navbar";

export default function UpSkill() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    async function fetchAIData() {
      try {
        const data = await getAIRecommendations(user?.token);
        setJobs(data.jobs || []);
        setGigs(data.gigs || []);
      } catch (err) {
        console.error("Failed to fetch upskill data:", err);
      }
    }

    if (user?.role === "student") {
      fetchAIData();
    }
  }, [user]);

  const JobCard = ({ job }) => {
    const missingSkills = job?.missing_skills || [];

    return (
      <div className="border p-4 rounded shadow mb-4 bg-white">
        <h4 className="text-lg font-bold text-blue-800">{job.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{job.company}</p>
        <p className="text-gray-700">{job.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Required: {job.required_skills.join(", ")}
        </p>

        {missingSkills.length === 0 ? (
          <button className="mt-3 px-4 py-1 bg-green-600 text-white rounded">
            Apply Now
          </button>
        ) : (
          <div className="mt-3 text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
            Missing skills: {missingSkills.join(", ")}
          </div>
        )}
      </div>
    );
  };

  const GigCard = ({ gig }) => {
    const missingSkills = gig?.missing_skills || [];

    return (
      <div className="border p-4 rounded shadow mb-4 bg-white">
        <h4 className="text-lg font-bold text-green-800">{gig.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{gig.company}</p>
        <p className="text-gray-700">{gig.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Required: {gig.required_skills.join(", ")}
        </p>

        {missingSkills.length === 0 ? (
          <button className="mt-3 px-4 py-1 bg-green-600 text-white rounded">
            Apply Now
          </button>
        ) : (
          <div className="mt-3 text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
            Missing skills: {missingSkills.join(", ")}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Upskill Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Jobs */}
          <div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Jobs</h3>
            {jobs.length ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>

          {/* Gigs */}
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
