import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-2">404</h1>
      <div className="text-xl mb-6 text-blue-700">Page Not Found</div>
      <button
        className="px-5 py-2 bg-blue-700 text-white rounded-2xl hover:bg-blue-600"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}
