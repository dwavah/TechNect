// src/pages/employer/PostGig.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postGig } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PostGig() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    required_skills: "",
    status: "published", // default status
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postGig({ ...form, posted_by: user._id }, user.token);
      toast.success(
        form.status === "draft" ? "Gig saved as draft." : "Gig posted successfully!"
      );
      navigate("/employer/gigs");
    } catch (err) {
      toast.error("Failed to post gig.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
    </section>
  );
}
