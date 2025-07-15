// src/pages/employer/PostGig.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { postGig, getGigs, deleteGig } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function PostGig() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    required_skills: "",
    budget: "",
    deadline: "",
    status: "published", // default
  });

  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit gig
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postGig({ ...form, posted_by: user._id }, user.token);
      toast.success(
        form.status === "draft" ? "Gig saved as draft." : "Gig posted successfully!"
      );
      setForm({
        title: "",
        description: "",
        location: "",
        required_skills: "",
        budget: "",
        deadline: "",
        status: "published",
      });
      fetchGigs();
    } catch (err) {
      toast.error("Failed to post gig.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch employer's gigs
  const fetchGigs = async () => {
    try {
      const allGigs = await getGigs(user.token);
      const employerGigs = allGigs.filter((gig) => gig.posted_by === user._id);
      setGigs(employerGigs);
    } catch {
      toast.error("Failed to load gigs");
    }
  };

  useEffect(() => {
    if (user?.token) fetchGigs();
  }, [user]);

  // Delete a gig
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this gig?");
    if (!confirm) return;

    try {
      await deleteGig(id, user.token);
      toast.success("Gig deleted");
      fetchGigs();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-900">Post a Gig</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow mb-10">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Gig Title"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Gig Description"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="Required Skills (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Budget in USD"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="published">Publish Now</option>
            <option value="draft">Save as Draft</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Gigs</h3>
          {gigs.length === 0 ? (
            <p className="text-gray-500">No gigs posted yet.</p>
          ) : (
            <div className="space-y-4">
              {gigs.map((gig) => (
                <div
                  key={gig.id}
                  className="border p-4 rounded shadow flex justify-between items-start bg-white"
                >
                  <div>
                    <h4 className="text-lg font-bold text-green-900">{gig.title}</h4>
                    <p className="text-sm text-gray-700">{gig.description}</p>
                    <div className="text-sm text-gray-500">
                      📍 {gig.location} | 🛠️ {gig.required_skills} | 💰 ${gig.budget} | ⏰ Deadline: {gig.deadline}
                    </div>
                  </div>
                  <div className="space-x-2 mt-2">
                    <button className="text-green-600 hover:underline text-sm">Edit</button>
                    <button
                      onClick={() => handleDelete(gig.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
