// src/pages/employer/Applicants.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

export default function Applicants() {
  const { id } = useParams(); // job ID
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch(`http://localhost:4000/api/employer/jobs/${id}/applicants`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching applicants");
        setApplicants(data);
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchApplicants();
  }, [id, user.token]);

  return (
    <>
      <Navbar />
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-yellow-900">Applicants</h2>
        {applicants.length === 0 ? (
          <p className="text-gray-600">No one has applied for this job yet.</p>
        ) : (
          <table className="w-full border bg-white rounded">
            <thead>
              <tr className="bg-yellow-100 text-yellow-900">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">University</th>
                <th className="p-3 text-left">Skills</th>
                <th className="p-3 text-left">CV</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(app => (
                <tr key={app._id} className="border-t">
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.university}</td>
                  <td className="p-3">{app.skills?.join(", ")}</td>
                  <td className="p-3">
                    {app.cv ? (
                      <a href={app.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          className="mt-6 bg-blue-100 text-blue-900 px-4 py-2 rounded hover:bg-blue-50"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </section>
    </>
  );
}
