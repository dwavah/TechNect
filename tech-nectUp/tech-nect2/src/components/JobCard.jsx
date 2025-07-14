import React from "react";
import { BriefcaseIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";

// showApply: show the Apply button (default false)
// onApply: function to call when Apply is clicked
// onClick: function to call when the card itself is clicked (e.g. for details)
export default function JobCard({ job, onApply, showApply = false, onClick }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 mb-5 border-l-4 border-blue-400 hover:scale-105 transition-all cursor-pointer"
      whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(0, 0, 128, 0.1)" }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <BriefcaseIcon className="h-7 w-7 text-blue-600" />
        <span className="font-bold text-xl">{job.title}</span>
      </div>
      <div className="text-blue-700">
        {job.company} <span className="text-sm text-gray-600">| {job.location}</span>
      </div>
      <div className="my-2 text-slate-700">{job.description}</div>
      {job.required_skills && job.required_skills.length > 0 && (
        <div className="mb-1">
          <strong>Skills:</strong> {job.required_skills.join(", ")}
        </div>
      )}
      {showApply && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-3 hover:bg-green-500"
          onClick={e => { e.stopPropagation(); onApply && onApply(job); }}
        >
          Apply
        </button>
      )}
    </motion.div>
  );
}
