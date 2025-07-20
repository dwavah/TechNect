// src/pages/Gigs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGigs } from "../utils/api";
import GigCard from "../components/GigCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Gigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;
    async function fetchGigs() {
      setLoading(true);
      try {
        const data = await getGigs(user.token);
        console.log("ALL GIGS:", data); // Expecting an array
        setGigs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching gigs:", err);
      }
      setLoading(false);
    }

    fetchGigs();
  }, [user?.token]);

  const filteredGigs = gigs.filter(
    (g) =>
      g.title?.toLowerCase().includes(q.toLowerCase()) ||
      (g.company && g.company.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-4 text-blue-900">Available Gigs</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search gigs..."
          className="w-full mb-6 px-4 py-2 rounded border focus:ring-2 focus:ring-blue-300"
        />
        {loading ? (
          <div>Loading...</div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-slate-500">No gigs found.</div>
        ) : (
          filteredGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              onClick={() => navigate(`/gigs/${gig.id}`)}
            />
          ))
        )}
      </section>
    </>
  );
}
