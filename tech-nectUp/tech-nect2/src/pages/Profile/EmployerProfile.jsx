import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserGroupIcon, PencilAltIcon, CheckIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function EmployerProfile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      axios
        .get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((res) => {
          setName(res.data.name || "");
          setCompany(res.data.company || "");
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile");
          setLoading(false);
        });
    }
  }, [user]);

  const handleSave = async () => {
    setEditing(false);
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile",
        { name, company },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Profile updated!");
      login({ ...user, name: res.data.name, company: res.data.company });
    } catch {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      {/* aced */}
      <Navbar />

      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-xl shadow flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-yellow-200 flex items-center justify-center mb-4">
          <UserGroupIcon className="h-12 w-12 text-yellow-600" />
        </div>

        {!editing ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <div className="mb-1 text-yellow-800 font-semibold">{user?.email}</div>
            <div className="mb-3 text-gray-500">Role: {user?.role}</div>
            <div className="mb-3 text-gray-700">
              Company: {company || <span className="text-gray-400">Not set</span>}
            </div>
            <button
              className="flex items-center gap-1 text-yellow-700 hover:underline"
              onClick={() => setEditing(true)}
            >
              <PencilAltIcon className="h-4 w-4" />
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              className="text-xl font-bold mb-2 border-b border-yellow-300 focus:outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="mb-1 text-yellow-800 font-semibold">{user?.email}</div>
            <div className="mb-3 text-gray-500">Role: {user?.role}</div>
            <input
              className="mb-3 border px-2 py-1 rounded w-full"
              placeholder="Company name"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
            <button
              className="flex items-center gap-1 text-green-700 hover:underline"
              onClick={handleSave}
            >
              <CheckIcon className="h-4 w-4" />
              Save Profile
            </button>
          </>
        )}
      </div>
    </>
  );
}
