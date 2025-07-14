import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (!form.email || !form.password) {
        alert("Please fill in all fields.");
        return;
      }
      // Replace with API login
      login({ name: form.email.split("@")[0], email: form.email, role: form.role });
      navigate(form.role === "student" ? "/jobs" : "/gigs");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border px-4 py-2 rounded"
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoComplete="username"
      />
      <input
        className="w-full border px-4 py-2 rounded"
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
      />
      <select
        name="role"
        className="w-full border px-4 py-2 rounded"
        value={form.role}
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="employer">Employer</option>
      </select>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded font-bold text-white ${loading ? 'bg-blue-300' : 'bg-blue-700 hover:bg-blue-500'}`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
