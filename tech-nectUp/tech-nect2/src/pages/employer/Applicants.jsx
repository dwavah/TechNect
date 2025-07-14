import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerApplicants } from "../../utils/api";

export default function Applicants() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplicants() {
      setLoading(true);
      const data = await getEmployerApplicants(user.token);
      setApplicants(Array.isArray(data) ? data : data.applicants || []);
      setLoading(false);
    }
    fetchApplicants();
  }, [user.token]);

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">Job Applicants</h2>
      {loading ? (
        <div>Loading...</div>
      ) : applicants.length === 0 ? (
        <div className="text-slate-500">No applicants found.</div>
      ) : (
        <ul>
          {applicants.map(app => (
            <li key={app._id || app.id} className="mb-4 p-4 rounded bg-yellow-50">
              <div className="font-bold">{app.studentName}</div>
              <div>{app.jobTitle}</div>
              <div className="text-sm text-gray-600">{app.status}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
