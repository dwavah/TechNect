import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/Herosection";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main>
      <HeroSection onGetStarted={() => navigate("/start")} />

      {user && (
        <div className="mt-10 flex flex-col items-center gap-4">
          {/* Role-specific quick access */}
          {user.role === "student" && (
            <>
              <button
                onClick={() => navigate("/jobs")}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg"
              >
                Jobs
              </button>
              <button
                onClick={() => navigate("/gigs")}
                className="px-6 py-2 bg-green-700 text-white rounded-lg"
              >
                Gigs
              </button>
              <button
                onClick={() => navigate("/upskill")}
                className="px-6 py-2 bg-purple-700 text-white rounded-lg"
              >
                Upskill
              </button>
            </>
          )}
          {user.role === "employer" && (
            <>
              <button
                onClick={() => navigate("/employer/jobs")}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg"
              >
                My Jobs
              </button>
              <button
                onClick={() => navigate("/employer/jobs/post")}
                className="px-6 py-2 bg-yellow-500 text-blue-900 rounded-lg"
              >
                Post Job
              </button>
              <button
                onClick={() => navigate("/employer/dashboard")}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg"
              >
                Employer Dashboard
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
