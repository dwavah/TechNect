import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { BriefcaseIcon, PlusCircleIcon } from "@heroicons/react/outline";
import axios from "axios";

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/jobs?employerId=${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(res => {
          setJobs(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading jobs...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-800">
          <BriefcaseIcon className="w-6 h-6" />
          My Jobs
        </h2>
        <Link
          to="/employer/jobs/post"
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
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} className="border-b last:border-none">
                  <td className="py-2 px-4">{job.title}</td>
                  <td className="py-2 px-4">{job.applicants?.length || 0}</td>
                  <td className="py-2 px-4">{job.status || "Open"}</td>
                  <td className="py-2 px-4">
                    <Link to={`/jobs/${job._id}`} className="text-blue-700 hover:underline">View</Link>
                    <Link to={`/employer/jobs/${job._id}/edit`} className="ml-2 text-yellow-700 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
