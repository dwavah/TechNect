import React from "react";
import { motion } from "framer-motion";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function GigCard({ gig, onApply, showApply = false }) {
  // Fallbacks for possible undefined fields
  const skills = gig.skills?.length ? gig.skills : [];
  const pay = gig.pay || "N/A";
  const duration = gig.duration || "N/A";
  const postedBy = gig.posted_by || gig.company || "Unknown";

  return (
    <motion.div
      className="bg-yellow-50 rounded-2xl shadow-lg p-5 mb-5 border-l-4 border-yellow-400 hover:scale-105 transition-all"
      whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(180, 140, 0, 0.12)" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <BoltIcon className="h-6 w-6 text-yellow-500" />
        <span className="font-bold">{gig.title}</span>
      </div>
      <div className="text-slate-800">{gig.description}</div>
      <div className="text-sm text-gray-700 mb-2">
        Skills: {skills.join(", ")}
      </div>
      <div className="flex gap-3 mb-1">
        <span className="bg-yellow-200 text-yellow-800 px-2 rounded">{pay}</span>
        <span className="bg-blue-200 text-blue-800 px-2 rounded">{duration}</span>
      </div>
      <div className="text-right text-xs mt-2 text-blue-700">
        Posted by: {postedBy}
      </div>
      {/* Show Apply button only when intended */}
      {showApply && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-3 hover:bg-green-500"
          onClick={e => {
            e.stopPropagation();
            onApply ? onApply(gig) : alert('Application submitted!');
          }}
        >
          Apply
        </button>
      )}
    </motion.div>
  );
}
