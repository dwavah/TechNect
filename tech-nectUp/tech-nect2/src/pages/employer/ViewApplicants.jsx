import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getJobApplicants, updateApplicationStatus } from "../../utils/api";
import toast from "react-hot-toast";

export default function ViewApplicants() {
  const { id } = useParams(); // jobId
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getJobApplicants(id, user.token);
        setApplicants(res);
      } catch (err) {
        toast.error("Failed to load applicants.");
        console.error(err);
      }
    }
    fetch();
  }, [id, user.token]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status, user.token);
      setApplicants(prev =>
        prev.map(a => (a.id === applicationId ? { ...a, status } : a))
      );
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Applicants for this Job</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-slate-100">
              <th>Name</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(({ id, status, Student }) => (
              <tr key={id}>
                <td>{Student?.name}</td>
                <td>{Student?.email}</td>
                <td>{Student?.skills}</td>
                <td className="capitalize">{status}</td>
                <td>
                  <button
                    className="px-2 py-1 bg-green-200 mr-2 rounded"
                    onClick={() => handleStatusUpdate(id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-2 py-1 bg-red-200 rounded"
                    onClick={() => handleStatusUpdate(id, "denied")}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
