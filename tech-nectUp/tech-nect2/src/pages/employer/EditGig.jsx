import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { editGig, getGigs } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditGig() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);

  useEffect(() => {
    async function fetchGig() {
      try {
        const allGigs = await getGigs(user.token);
        const target = allGigs.data.find((g) => g.id === parseInt(id));
        if (target) setGig(target);
        else toast.error("Gig not found");
      } catch {
        toast.error("Error loading gig.");
      }
    }
    fetchGig();
  }, [id, user.token]);

  const handleChange = (e) => {
    setGig({ ...gig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editGig(id, gig, user.token);
      toast.success("Gig updated successfully!");
      navigate("/employer/gigs");
    } catch {
      toast.error("Failed to update gig.");
    }
  };

  if (!gig) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Edit Gig</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "company", "location"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={gig[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
          Save Changes
        </button>
      </form>
    </div>
  );
}
