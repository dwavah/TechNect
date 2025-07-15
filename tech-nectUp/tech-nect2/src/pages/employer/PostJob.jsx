// src/pages/employer/PostJob.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { postJob, getJobs, deleteJob } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postJob({ ...form, posted_by: user._id }, user.token);
      toast.success(
        form.status === "draft" ? "Saved as draft." : "Job posted!"
      );
      setForm({
        title: "",
        description: "",
        location: "",
        required_skills: "",
        deadline: "",
        status: "published",
      });
      fetchJobs();
    } catch (err) {
      toast.error("Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs posted by this employer
  const fetchJobs = async () => {
    try {
      const allJobs = await getJobs(user.token);
      const employerJobs = allJobs.filter(
        (job) => job.posted_by === user._id
      );
      setJobs(employerJobs);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchJobs();
    }
  }, [user]);

  // Delete a job
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this job?");
    if (!confirm) return;

    try {
      await deleteJob(id, user.token);
      toast.success("Job deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Post a Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow mb-10">
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
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Jobs</h3>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border p-4 rounded shadow flex justify-between items-start bg-white"
                >
                  <div>
                    <h4 className="text-lg font-bold text-blue-900">{job.title}</h4>
                    <p className="text-sm text-gray-700">{job.description}</p>
                    <div className="text-sm text-gray-500">
                      📍 {job.location} | 🛠️ {job.required_skills} | ⏰ Deadline: {job.deadline}
                    </div>
                  </div>
                  <div className="space-x-2 mt-2">
                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                    <button
                      onClick={() => handleDelete(job.id)}
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
