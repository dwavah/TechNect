import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { registerUser } from "../utils/api";

export default function Register() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirmPwd) {
      toast.error("Passwords do not match.");
      return;
    }
    if (role === "employer" && !company) {
      toast.error("Company name is required for employers.");
      return;
    }

    setLoading(true);
    const data = await registerUser({
      role,
      email,
      name,
      password,
      company: role === "employer" ? company : undefined,
    });
    setLoading(false);

    if (data.success) {
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } else {
      toast.error(data.message || "Registration failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 px-4">
      <div className="mb-6 flex flex-col items-center">
        <span className="inline-block bg-white shadow rounded-full p-4 mb-2 animate-bounce">
          <UserPlus className="w-8 h-8 text-blue-700" />
        </span>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-1">Create an Account</h2>
        <p className="text-slate-700 text-sm">
          Join Tech-Nect and unlock your opportunities!
        </p>
      </div>
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-xl p-8 max-w-sm w-full space-y-5"
      >
        <div className="flex justify-center mb-4 gap-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-blue-700"
            }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              role === "employer"
                ? "bg-yellow-500 text-blue-900"
                : "bg-slate-100 text-yellow-800"
            }`}
            onClick={() => setRole("employer")}
          >
            Employer
          </button>
        </div>
        <div>
          <label className="block mb-1 text-blue-700">Name</label>
          <input
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "student" ? "Your name" : "Contact person"}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-blue-700">Email</label>
          <input
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@example.com"
            required
          />
        </div>
        {role === "employer" && (
          <div>
            <label className="block mb-1 text-yellow-700">Company Name</label>
            <input
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              required={role === "employer"}
            />
          </div>
        )}
        <div>
          <label className="block mb-1 text-blue-700">Password</label>
          <input
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-blue-700">Confirm Password</label>
          <input
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-2xl font-bold text-white transition ${
            loading ? "bg-blue-300" : "bg-blue-700 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <span
            className="text-blue-700 underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
