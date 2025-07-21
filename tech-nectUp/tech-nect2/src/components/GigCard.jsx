// src/components/GigCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { applyToGig } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function GigCard({ gig, showApply = true }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    const confirm = window.confirm(`Are you sure you want to apply for "${gig.title}"?`);
    if (!confirm) return;

    try {
      await applyToGig(gig.id, user.id);
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
      className="bg-yellow-50 rounded-2xl shadow p-5 mb-4 border-l-4 border-yellow-400 hover:scale-105 transition"
      whileHover={{ y: -6, boxShadow: "0 12px 28px rgba(180, 140, 0, 0.12)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <BoltIcon className="h-6 w-6 text-yellow-500" />
        <span className="font-bold text-yellow-800">{gig.title}</span>
      </div>
      <p className="text-slate-800">{gig.description}</p>
      <p className="text-sm text-gray-600">Company: {gig.company}</p>
      <p className="text-sm text-gray-600">Location: {gig.location}</p>
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
