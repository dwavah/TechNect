import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { AcademicCapIcon, BriefcaseIcon, BoltIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Demo stats—replace with real data from backend as you integrate!
  const applications = 2; // e.g., user.applications?.length || 0
  const gigsCompleted = 1; // e.g., user.gigsCompleted?.length || 0
  const skillsCount = user?.skills ? user.skills.length : 0;

  return (
    <div>
      {/* the top */}
      <Navbar />

      {/*  in */}
      <motion.div
        className="max-w-3xl mx-auto p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-3">Welcome, {user?.name || "Student"}!</h2>
        <div className="mb-3">You are logged in as a <b>Student</b>.</div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-blue-100 p-5 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-blue-900">{applications}</div>
            <div className="text-blue-800">Applications</div>
          </div>
          <div className="bg-green-100 p-5 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-green-900">{gigsCompleted}</div>
            <div className="text-green-800">Gigs Completed</div>
          </div>
          <div className="bg-yellow-100 p-5 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-yellow-900">{skillsCount}</div>
            <div className="text-yellow-800">Skills</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            to="/student/profile"
            className="bg-blue-700 text-white px-6 py-4 rounded-2xl shadow hover:bg-blue-500 flex items-center gap-2"
          >
            <AcademicCapIcon className="h-6 w-6" />
            Profile
          </Link>
          <Link
            to="/jobs"
            className="bg-yellow-400 text-blue-900 px-6 py-4 rounded-2xl shadow hover:bg-yellow-300 flex items-center gap-2"
          >
            <BriefcaseIcon className="h-6 w-6" />
            See Jobs
          </Link>
          <Link
            to="/gigs"
            className="bg-green-400 text-white px-6 py-4 rounded-2xl shadow hover:bg-green-300 flex items-center gap-2"
          >
            <BoltIcon className="h-6 w-6" />
            Explore Gigs
          </Link>
        </div>

        {/* Motivational / Info section */}
        <div className="mt-10">
          <div className="text-lg text-blue-900 font-semibold mb-4">
            Start applying for jobs or gigs to build your career!
          </div>
          {/* You can add recent applications, suggestions, or activity feed here */}
        </div>
      </motion.div>
    </div>
  );
}
