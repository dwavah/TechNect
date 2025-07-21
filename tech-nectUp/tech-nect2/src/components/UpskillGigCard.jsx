import React from "react";

export default function UpskillGigCard({ gig, userSkills = [] }) {
  const required = Array.isArray(gig.required_skills) ? gig.required_skills : [];
  const missingSkills = required.filter(
    (skill) => !userSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  return (
    <div className="bg-yellow-50 p-4 rounded-lg shadow border mb-4">
      <h4 className="text-yellow-800 font-semibold text-lg">{gig.title}</h4>
      <p className="text-gray-700 mt-1">{gig.description}</p>
      <p className="text-gray-600 text-sm mt-2">Company: {gig.company || "Unknown Company"}</p>
      <p className="text-gray-600 text-sm">Location: {gig.location}</p>

      {missingSkills.length > 0 ? (
        <p className="mt-3 text-red-600 text-sm font-semibold">
          Missing skills: {missingSkills.join(", ")}
        </p>
      ) : (
        <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Apply
        </button>
      )}
    </div>
  );
}
