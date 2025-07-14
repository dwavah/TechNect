import React from "react";

export default function AdminDashboard() {
  // Ideally, fetch stats from the backend!
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-900">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 text-blue-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Total Users</div>
          <div className="text-3xl font-black">123</div>
        </div>
        <div className="bg-green-100 text-green-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Jobs Posted</div>
          <div className="text-3xl font-black">45</div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-xl shadow">
          <div className="text-lg font-bold mb-1">Applications</div>
          <div className="text-3xl font-black">72</div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">User Management (Coming Soon)</h3>
        {/* Add tables and actions for user management, stats, etc */}
        <p className="text-gray-500">You can add/manage users, jobs, gigs, and view stats here.</p>
      </div>
    </section>
  );
}
