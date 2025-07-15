// src/pages/employer/EmployerGigs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerGigs, deleteGig } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployerGigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const data = await getEmployerGigs(user.token);
        setGigs(Array.isArray(data) ? data : data.gigs || []);
      } catch (err) {
        toast.error("Failed to fetch gigs.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.token) fetchGigs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await deleteGig(id, user.token);
      setGigs((prev) => prev.filter((g) => g._id !== id));
      toast.success("Gig deleted.");
    } catch (err) {
      toast.error("Failed to delete gig.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-green-800">My Gigs</h2>
        <button
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/employer/gigs/new")}
        >
          + Post New Gig
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : gigs.length === 0 ? (
        <div className="text-gray-500">No gigs posted yet.</div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-green-900">
                    {gig.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {gig.status === "draft" ? (
                      <span className="text-yellow-600 font-medium">[Draft]</span>
                    ) : (
                      <span className="text-green-700">Published</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="text-blue-700 hover:underline"
                    onClick={() => navigate(`/employer/gigs/${gig._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(gig._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
