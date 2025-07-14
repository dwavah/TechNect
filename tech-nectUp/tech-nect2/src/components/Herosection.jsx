import React from "react";
import logo from "../assets/logo.svg";

export default function HeroSection({ onGetStarted }) {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-blue-50 to-blue-100">
      {/* App Logo or Illustration */}
      <div className="mb-6 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-full p-6 animate-bounce">
          <img
            src={logo}
            alt="TechNect Logo"
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-blue-900">
        Connect. Innovate. Grow.
      </h1>
      <p className="max-w-2xl text-blue-700 mb-8 text-lg">
        Discover opportunities, connect with top tech talent, and accelerate your career or company—all in one place.
      </p>
      <button
        onClick={onGetStarted}
        className="bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow hover:bg-blue-600 transition"
      >
        Get Started
      </button>
    </section>
  );
}
