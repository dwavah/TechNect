import React from "react";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">Welcome to Tech-Nect!</h2>
        <p className="mb-6 text-slate-700">
          Please choose an option to continue:
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="w-full py-2 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
