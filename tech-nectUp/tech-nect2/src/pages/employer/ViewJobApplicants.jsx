// src/pages/employer/ViewApplicants.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobApplicants, updateJobApplicationStatus } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ViewApplicants() {
  const { id: jobId } = useParams();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const data = await getJobApplicants(jobId, user.token);
        setApplicants(data);
      } catch (err) {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, [jobId, user.token]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateJobApplicationStatus(appId, newStatus, user.token);
      toast.success(`Application ${newStatus}`);
      setApplicants((prev) =>
        prev.map((a) => (a.applicationId === appId ? { ...a, status: newStatus } : a))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <section className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Applicants for Job #{jobId}</h2>
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((applicant) => (
            <li
              key={applicant.id}
              className="bg-white border rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{applicant.name}</p>
                <p className="text-sm text-gray-600">{applicant.email}</p>
                <p className="text-sm text-gray-700">
                  Skills: {Array.isArray(applicant.skills) ? applicant.skills.join(", ") : applicant.skills}
                </p>
              </div>
              <div className="space-x-2">
                <span className="text-sm font-medium">
                  Status: <span className="capitalize">{applicant.status}</span>
                </span>
                {applicant.status === "pending" && (
                  <>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleUpdateStatus(applicant.applicationId, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleUpdateStatus(applicant.applicationId, "denied")}
                    >
                      Deny
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
