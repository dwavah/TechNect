import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getEmployerGigs } from "../../utils/api";
import GigCard from "../../components/GigCard";
import { useNavigate } from "react-router-dom";

export default function EmployerGigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      const data = await getEmployerGigs(user.token);
      setGigs(Array.isArray(data) ? data : data.gigs || []);
      setLoading(false);
    }
    fetchGigs();
  }, [user.token]);

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-yellow-800">My Gigs</h2>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
          onClick={() => navigate("/employer/gigs/new")}
        >
          + Post New Gig
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : gigs.length === 0 ? (
        <div className="text-slate-500">No gigs posted yet.</div>
      ) : (
        gigs.map(gig => <GigCard key={gig._id || gig.id} gig={gig} />)
      )}
    </section>
  );
}
