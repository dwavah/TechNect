// src/pages/employer/CompanyProfile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../utils/api";
import toast from "react-hot-toast";

export default function CompanyProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    company_name: "",
    description: "",
    website: "",
    industry: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile(user.token);
        setForm({
          company_name: data.company_name || "",
          description: data.description || "",
          website: data.website || "",
          industry: data.industry || "",
          location: data.location || "",
        });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(form, user.token);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update.");
    }
  };

  if (loading) return <div className="p-6 text-blue-600">Loading company profile...</div>;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Company Profile</h2>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <input
          type="text"
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Company Name"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Company Description"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Website (optional)"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="industry"
          value={form.industry}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Industry"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
        />

        {editing ? (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 mt-4"
          >
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
}
