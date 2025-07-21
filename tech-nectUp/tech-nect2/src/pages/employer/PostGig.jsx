// src/pages/employer/PostGig.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postGig } from "../../utils/api";
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
    publish_status: "published",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
  ...form,
  posted_by: user.id,
  required_skills: form.required_skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};


    try {
      await postGig(payload, user.token);
      toast.success(
        form.status === "draft" ? "Gig saved as draft." : "Gig posted successfully!"
      );
      navigate("/employer/gigs");
    } catch (error) {
      console.error("Post gig error:", error);
      toast.error("Failed to post gig.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-900">Post a Gig</h2>
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
            {loading
              ? "Submitting..."
              : form.status === "draft"
              ? "Save Draft"
              : "Post Gig"}
          </button>
        </form>
      </section>
    </>
  );
}
