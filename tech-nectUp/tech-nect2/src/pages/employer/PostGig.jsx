import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postGig } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PostGig() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(user.company || "");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = { title, company, location, description };
    const res = await postGig(data, user.token);
    setLoading(false);
    if (res.success === false) {
      toast.error(res.message || "Failed to post gig");
    } else {
      toast.success("Gig posted!");
      navigate("/employer/gigs");
    }
  };

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-yellow-800">Post a New Gig</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="text"
          placeholder="Gig Title"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Company"
          className="w-full px-3 py-2 border rounded"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Location"
          className="w-full px-3 py-2 border rounded"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <textarea
          required
          placeholder="Description"
          className="w-full px-3 py-2 border rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-yellow-500 text-white px-6 py-2 rounded font-bold hover:bg-yellow-400"
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </section>
  );
}
