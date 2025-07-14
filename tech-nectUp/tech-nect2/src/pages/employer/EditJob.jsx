import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerJobs, editJob } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditJob() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      const data = await getEmployerJobs(user.token);
      const allJobs = Array.isArray(data) ? data : data.jobs || [];
      setJob(allJobs.find(j => (j._id || j.id) === id));
      setLoading(false);
    }
    fetchJob();
  }, [id, user.token]);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    required_skills: ""
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        required_skills: job.required_skills ? job.required_skills.join(", ") : ""
      });
    }
  }, [job]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      required_skills: form.required_skills.split(",").map(s => s.trim())
    };
    const res = await editJob(id, data, user.token);
    setLoading(false);
    if (res.success === false) {
      toast.error(res.message || "Failed to update job");
    } else {
      toast.success("Job updated!");
      navigate("/employer/jobs");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8 text-red-500">Job not found.</div>;

  return (
    <section className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Edit Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="text"
          name="title"
          placeholder="Job Title"
          className="w-full px-3 py-2 border rounded"
          value={form.title}
          onChange={handleChange}
        />
        <input
          required
          type="text"
          name="company"
          placeholder="Company"
          className="w-full px-3 py-2 border rounded"
          value={form.company}
          onChange={handleChange}
        />
        <input
          required
          type="text"
          name="location"
          placeholder="Location"
          className="w-full px-3 py-2 border rounded"
          value={form.location}
          onChange={handleChange}
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="w-full px-3 py-2 border rounded"
          value={form.description}
          onChange={handleChange}
        />
        <input
          required
          type="text"
          name="required_skills"
          placeholder="Required Skills (comma-separated)"
          className="w-full px-3 py-2 border rounded"
          value={form.required_skills}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
