// src/pages/employer/EditGig.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerGigs, editGig } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditGig() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    required_skills: "",
    status: "published"
  });

  useEffect(() => {
    async function fetchGig() {
      try {
        setLoading(true);
        const data = await getEmployerGigs(user.token);
        const allGigs = Array.isArray(data) ? data : data.gigs || [];
        const found = allGigs.find((g) => (g._id || g.id) === id);
        setGig(found);
        if (found) {
          setForm({
            title: found.title,
            location: found.location,
            description: found.description,
            required_skills: found.required_skills
              ? found.required_skills.join(", ")
              : "",
            status: found.status || "published"
          });
        }
      } catch (err) {
        toast.error("Failed to fetch gig");
      } finally {
        setLoading(false);
      }
    }

    fetchGig();
  }, [id, user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        required_skills: form.required_skills
          .split(",")
          .map((s) => s.trim()),
      };
      const res = await editGig(id, payload, user.token);
      if (res.success === false) {
        toast.error(res.message || "Failed to update gig");
      } else {
        toast.success("Gig updated!");
        navigate("/employer-gigs");
      }
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!gig) return <div className="p-6 text-red-600">Gig not found.</div>;

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Edit Gig</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
          value={form.location}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="required_skills"
          placeholder="Required Skills (comma-separated)"
          className="w-full border px-3 py-2 rounded"
          value={form.required_skills}
          onChange={handleChange}
        />
        <select
          name="status"
          className="w-full border px-3 py-2 rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="published">Publish Now</option>
          <option value="draft">Save as Draft</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
