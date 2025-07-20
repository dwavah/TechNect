// src/pages/employer/EmployerGigs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerGigs, deleteGig } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar"; // ✅ Import the Navbar

export default function EmployerGigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id || !user?.token) return;

    async function fetchGigs() {
      setLoading(true);
      try {
        const data = await getEmployerGigs(user.id, user.token);
        console.log("Fetched gigs:", data);
        setGigs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        toast.error("Failed to fetch gigs.");
      } finally {
        setLoading(false);
      }
    }

    fetchGigs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await deleteGig(id, user.token);
      setGigs((prev) => prev.filter((g) => g.id !== id));
      toast.success("Gig deleted.");
    } catch (err) {
      console.error("Error deleting gig:", err);
      toast.error("Failed to delete gig.");
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Render Navbar here */}
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
                key={gig.id}
                className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">
                      {gig.title} – {gig.location}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {gig.publish_status === "draft" ? (
                        <span className="text-yellow-600 font-medium">[Draft]</span>
                      ) : (
                        <span className="text-green-700">Published</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-blue-700 hover:underline"
                      onClick={() => navigate(`/employer/gigs/${gig.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(gig.id)}
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
    </>
  );
}
