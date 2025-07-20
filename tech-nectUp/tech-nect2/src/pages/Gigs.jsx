// src/pages/Gigs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGigs } from "../utils/api";
import GigCard from "../components/GigCard";
import Navbar from "../components/Navbar";

export default function Gigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const data = await getGigs(user.token);
        setGigs(Array.isArray(data) ? data : data.gigs || []);
      } catch (err) {
        console.error("Error fetching gigs:", err);
      }
      setLoading(false);
    }
    fetchGigs();
  }, [user.token]);

  return (
    <>
      <Navbar />
      <section className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-4 text-yellow-800">Available Gigs</h2>
        {loading ? (
          <div>Loading...</div>
        ) : gigs.length === 0 ? (
          <div className="text-slate-500">No gigs found.</div>
        ) : (
          gigs.map(gig => <GigCard key={gig._id || gig.id} gig={gig} />)
        )}
      </section>
    </>
  );
}
