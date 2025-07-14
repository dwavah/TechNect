import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStudentApplications } from "../utils/api"; // implement in api.js

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      const data = await getStudentApplications(user.token);
      setApplications(Array.isArray(data) ? data : data.applications || []);
      setLoading(false);
    }
    fetchApplications();
  }, [user.token]);

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">My Applications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-slate-500">No applications found.</div>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app._id || app.id} className="mb-4 p-4 rounded bg-blue-50">
              <div className="font-bold">{app.jobTitle}</div>
              <div>{app.company}</div>
              <div className="text-sm text-gray-600">{app.status}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
