import React from "react";
export default function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100 py-5 mt-16 text-center rounded-t-3xl shadow-inner">
      <div className="font-semibold">&copy; {new Date().getFullYear()} Tech-Nect Uganda &mdash; Connecting Campus Tech Talent</div>
      <div className="mt-1 text-xs">Made with 💙 for Ugandan innovation</div>
    </footer>
  );
}
