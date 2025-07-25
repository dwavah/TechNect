// src/pages/employer/PostJob.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { postJob, getEmployerJobs, deleteJob } from "../../utils/api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    required_skills: "",
    deadline: "",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobPayload = {
      ...form,
      required_skills: form.required_skills
        .split(",")
        .map((skill) => skill.trim()),
    };

    try {
      await postJob(jobPayload, user.token);
      toast.success(
        form.status === "draft" ? "Saved as draft." : "Job posted!"
      );
      navigate("/employer/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post job. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await getEmployerJobs(user.id, user.token);
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      toast.error("Could not fetch jobs.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id, user.token);
      toast.success("Job deleted.");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Post a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
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
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Posting..." : form.status === "draft" ? "Save Draft" : "Post Job"}
          </button>
        </form>
      </section>
    </>
  );
}
