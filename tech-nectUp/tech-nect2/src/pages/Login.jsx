// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock } from "lucide-react";
import { loginUser } from "../utils/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please enter all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, password, role });
      const data = response.data; // ✅ unwrap axios response

      console.log("LOGIN API RESPONSE", data);

      if (data.token && data.user) {
        login({ user: data.user, token: data.token });
        toast.success("Login successful!");

        const userRole = data.user.role;
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "employer") {
          navigate("/employer/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 px-4">
      <div className="mb-6 flex flex-col items-center">
        <span className="inline-block bg-white shadow rounded-full p-4 mb-2 animate-bounce">
          <Lock className="w-8 h-8 text-blue-700" />
        </span>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-1">Welcome Back!</h2>
        <p className="text-slate-700 text-sm">Sign in to continue</p>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-xl p-8 max-w-sm w-full space-y-5"
      >
        <div>
          <label className="block mb-1 text-blue-700">Email</label>
          <input
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-blue-700">Password</label>
          <div className="relative">
            <input
              className="w-full border px-4 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-800"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-blue-700">Role</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-2xl font-bold text-white transition ${
            loading ? "bg-blue-300" : "bg-blue-700 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-xs mt-2">
          <button
            type="button"
            className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer"
            onClick={() => toast("Password reset coming soon!")}
          >
            Forgot your password?
          </button>
        </div>

        <div className="text-center text-sm mt-2">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-700 underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}
