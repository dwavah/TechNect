import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { postJob } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(user.company || "");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [required_skills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title,
      company,
      location,
      description,
      required_skills: required_skills.split(",").map(s => s.trim())
    };
    const res = await postJob(data, user.token);
    setLoading(false);
    if (res.success === false) {
      toast.error(res.message || "Failed to post job");
    } else {
      toast.success("Job posted!");
      navigate("/employer/jobs");
    }
  };

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="text"
          placeholder="Job Title"
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
        <input
          required
          type="text"
          placeholder="Required Skills (comma-separated)"
          className="w-full px-3 py-2 border rounded"
          value={required_skills}
          onChange={e => setRequiredSkills(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-600"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </section>
  );
}
