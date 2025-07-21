// src/components/JobCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { applyToJob } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

export default function JobCard({ job, showApply = true }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    const confirm = window.confirm(`Are you sure you want to apply for "${job.title}"?`);
    if (!confirm) return;

    try {
      await applyToJob(job.id, user.id);
      toast.success("Application submitted successfully!");
      setApplied(true);
      setTimeout(() => navigate("/student/applications"), 2000);
    } catch (err) {
      toast.error("Failed to apply.");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="bg-blue-50 rounded-2xl shadow p-5 mb-4 border-l-4 border-blue-400 hover:scale-105 transition"
      whileHover={{ y: -6, boxShadow: "0 12px 28px rgba(0, 90, 255, 0.12)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <BriefcaseIcon className="h-6 w-6 text-blue-500" />
        <span className="font-bold text-blue-800">{job.title}</span>
      </div>
      <p className="text-slate-800">{job.description}</p>
      <p className="text-sm text-gray-600">Company: {job.company}</p>
      <p className="text-sm text-gray-600">Location: {job.location}</p>
      {showApply && (
        <button
          className="mt-3 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      )}
    </motion.div>
  );
}
