// src/pages/student/StudentProfile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PencilSquareIcon, CheckIcon, CameraIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      axios
        .get("http://localhost:4000/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((res) => {
          setName(res.data.name || "");
          setSkills(res.data.skills || []);
          setPhotoUrl(res.data.photoUrl || "");
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile");
          setLoading(false);
        });
    }
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/upload/profile-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      toast.success("Photo updated!");
      setPhotoUrl(res.data.photoUrl);
      login({ ...user, photoUrl: res.data.photoUrl });
    } catch {
      toast.error("Failed to upload photo.");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setEditing(false);
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:4000/api/profile",
        { name, skills },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Profile updated!");
      login({ ...user, name: res.data.name, skills: res.data.skills });
    } catch {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };
  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      {/* top */}
      <Navbar />

      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-xl shadow flex flex-col items-center">
        <div className="flex flex-col items-center relative">
          <div className="relative mb-4">
            <img
              src={
                photoUrl
                  ? photoUrl.startsWith("http")
                    ? photoUrl
                    : `http://localhost:4000${photoUrl}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
            />
            <button
              type="button"
              className="absolute bottom-1 right-1 bg-blue-700 text-white rounded-full p-1 hover:bg-blue-600"
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              title="Change Photo"
            >
              <CameraIcon className="h-5 w-5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploading}
            />
          </div>
          {!editing ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
              <div className="mb-1 text-blue-800 font-semibold">{user?.email}</div>
              <div className="mb-3 text-gray-500">Role: {user?.role}</div>
              <button
                className="flex items-center gap-1 text-blue-700 hover:underline"
                onClick={() => setEditing(true)}
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                className="text-xl font-bold mb-2 border-b border-blue-300 focus:outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div className="mb-1 text-blue-800 font-semibold">{user?.email}</div>
              <div className="mb-3 text-gray-500">Role: {user?.role}</div>
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
        <div className="w-full mt-6">
          <h4 className="font-semibold text-blue-900 mb-2">Your Skills</h4>
          {!editing ? (
            <div className="flex flex-wrap gap-2">
              {skills?.length ? (
                skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm">{skill}</span>
                ))
              ) : (
                <span className="text-gray-400">No skills listed yet.</span>
              )}
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      className="ml-1 text-red-400"
                      onClick={() => removeSkill(skill)}
                      type="button"
                    >✕</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border px-2 py-1 rounded"
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                />
                <button
                  className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-500"
                  onClick={addSkill}
                  type="button"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
