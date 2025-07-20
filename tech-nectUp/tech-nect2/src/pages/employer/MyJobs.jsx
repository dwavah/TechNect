import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { BriefcaseIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Navbar from "../../components/Navbar";

const BASE_URL = "http://localhost:4000/api";

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const handleViewApplicants = async (jobId) => {
    if (selectedJobId === jobId) {
      // Toggle off
      setSelectedJobId(null);
      setApplicants([]);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setApplicants(data);
      setSelectedJobId(jobId);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/jobs?employerId=${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          setJobs(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading jobs...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-800">
            <BriefcaseIcon className="w-6 h-6" />
            My Jobs
          </h2>
          <Link
            to="/employer/jobs/new"
            className="bg-yellow-700 text-white px-4 py-2 rounded-2xl flex items-center gap-1 hover:bg-yellow-600"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Post Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-gray-500">You haven’t posted any jobs yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-yellow-100 text-yellow-900">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Applicants</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <React.Fragment key={job._id}>
                    <tr className="border-b last:border-none">
                      <td className="py-2 px-4">{job.title}</td>
                      <td className="py-2 px-4">{job.applicants?.length || 0}</td>
                      <td className="py-2 px-4">{job.status || "Open"}</td>
                      <td className="py-2 px-4 space-x-3">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-blue-700 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          to={`/employer/jobs/${job._id}/edit`}
                          className="text-yellow-700 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleViewApplicants(job._id)}
                          className="text-green-700 hover:underline"
                        >
                          {selectedJobId === job._id ? "Hide" : "View Applicants"}
                        </button>
                      </td>
                    </tr>
                    {selectedJobId === job._id && (
                      <tr>
                        <td colSpan="4" className="bg-gray-50 px-4 py-3">
                          {applicants.length === 0 ? (
                            <div className="text-gray-500">No applicants yet.</div>
                          ) : (
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                              {applicants.map((a) => (
                                <li key={a.id}>
                                  <span className="font-medium">{a.name}</span> —{" "}
                                  {a.email} — {a.university || "N/A"}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
