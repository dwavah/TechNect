import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGigById, updateGig } from "../../utils/api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

export default function EditGig() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    required_skills: "",
    publish_status: "published",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGig() {
      try {
        const data = await getGigById(id, user.token);
        setForm({
          ...data,
          required_skills: data.required_skills.join(", "),
        });
      } catch (err) {
        toast.error("Failed to fetch gig.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.token) fetchGig();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedGig = {
        ...form,
        required_skills: form.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await updateGig(id, updatedGig, user.token);
      toast.success("Gig updated successfully!");
      navigate("/employer/gigs");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update gig.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-900">Edit Gig</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="Required Skills (comma separated)"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="publish_status"
            value={form.publish_status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="published">Publish</option>
            <option value="draft">Save as Draft</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Updating..." : "Update Gig"}
          </button>
        </form>
      </section>
    </>
  );
}
