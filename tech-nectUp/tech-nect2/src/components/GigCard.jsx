// src/components/GigCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function GigCard({ gig, onClick, onApply, showApply = false }) {
  // Fallbacks and field normalization
  const title = gig.title || "Untitled Gig";
  const description = gig.description || "No description provided.";
  const skills = gig.required_skills?.length ? gig.required_skills : [];
  const pay = gig.pay || "N/A";
  const duration = gig.duration || "N/A";
  const postedBy = gig.company || gig.posted_by || "Unknown";

  return (
    <motion.div
      onClick={onClick}
      className="bg-yellow-50 rounded-2xl shadow-lg p-5 mb-5 border-l-4 border-yellow-400 hover:scale-105 transition-all cursor-pointer"
      whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(180, 140, 0, 0.12)" }}
    >
      {/* Title + Icon */}
      <div className="flex items-center gap-3 mb-2">
        <BoltIcon className="h-6 w-6 text-yellow-500" />
        <span className="font-bold text-lg">{title}</span>
      </div>

      {/* Description */}
      <div className="text-slate-800 mb-2">{description}</div>

      {/* Skills */}
      <div className="text-sm text-gray-700 mb-2">
        Skills: {skills.length > 0 ? skills.join(", ") : "Not specified"}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-1">
        <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-sm">
          {pay}
        </span>
        <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-sm">
          {duration}
        </span>
      </div>

      {/* Posted by */}
      <div className="text-right text-xs mt-3 text-blue-700 italic">
        Posted by: {postedBy}
      </div>

      {/* Optional Apply Button */}
      {showApply && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-3 hover:bg-green-500"
          onClick={(e) => {
            e.stopPropagation();
            onApply ? onApply(gig) : alert("Application submitted!");
          }}
        >
          Apply
        </button>
      )}
    </motion.div>
  );
}
