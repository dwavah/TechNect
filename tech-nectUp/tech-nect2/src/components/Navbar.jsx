import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "font-bold text-yellow-400 underline underline-offset-4"
      : "hover:text-yellow-400 transition";

  // All navigation links, role based
  const commonLinks = [
    ...(user && user.role === "student"
      ? [
          <NavLink key="jobs" to="/jobs" className={linkClass} onClick={() => setOpen(false)}>Jobs</NavLink>,
          <NavLink key="gigs" to="/gigs" className={linkClass} onClick={() => setOpen(false)}>Gigs</NavLink>,
          <NavLink key="upskill" to="/upskill" className={linkClass} onClick={() => setOpen(false)}>Upskill</NavLink>,
          <NavLink key="dashboard" to="/student/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>,
          <NavLink key="profile" to="/student/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>,
        ]
      : []),
    ...(user && user.role === "employer"
      ? [
          <NavLink key="dashboard" to="/employer/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>,
          <NavLink key="profile" to="/employer/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>,
          <NavLink key="myjobs" to="/employer/jobs" className={linkClass} onClick={() => setOpen(false)}>My Jobs</NavLink>,
          <NavLink key="postjob" to="/employer/jobs/post" className={linkClass} onClick={() => setOpen(false)}>Post Job</NavLink>,
        ]
      : []),
  ];

  return (
    <nav className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <NavLink to="/" className="flex items-center gap-2">
        <img src={logo} alt="Tech-Nect Logo" className="h-10 w-10" />
        <span className="font-black text-2xl tracking-tight">Tech-Nect</span>
      </NavLink>

      {/* Hamburger for mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden block text-yellow-400 focus:outline-none"
        aria-label="Toggle navigation"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Desktop links */}
      <div className="md:flex gap-4 items-center hidden">
        {user && (
          <>
            <span className="text-yellow-300 font-semibold mr-2">
              Hi, {user.name}!
            </span>
            {commonLinks}
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="ml-2 px-3 py-1 rounded bg-yellow-500 text-blue-900 hover:bg-yellow-400 font-semibold"
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/register" className={linkClass}>Register</NavLink>
          </>
        )}
      </div>

      {/* Mobile links */}
      {open && (
        <div className="absolute top-16 right-4 bg-blue-800 text-white rounded-lg p-4 flex flex-col gap-3 z-50 md:hidden min-w-[180px] shadow">
          {user && (
            <>
              <span className="text-yellow-300 font-semibold mb-2">
                Hi, {user.name}!
              </span>
              {commonLinks}
              <button
                onClick={() => { logout(); navigate("/login"); setOpen(false); }}
                className="mt-2 px-3 py-1 rounded bg-yellow-500 text-blue-900 hover:bg-yellow-400 font-semibold"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
