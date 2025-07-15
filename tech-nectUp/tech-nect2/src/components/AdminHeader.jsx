import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminHeader() {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-purple-800">Admin Dashboard</h2>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
