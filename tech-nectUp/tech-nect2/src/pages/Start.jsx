import React from "react";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">Welcome to Tech-Nect</h2>
      <p className="text-blue-700 mb-8 text-center max-w-lg">
        Are you new here or already have an account?  
        Please select one of the options below to continue.
      </p>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold text-lg shadow hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 rounded-xl bg-yellow-400 text-blue-900 font-semibold text-lg shadow hover:bg-yellow-300"
        >
          Register
        </button>
      </div>
    </div>
  );
}
