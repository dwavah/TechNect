// utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// =======================
// Auth
// =======================
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// =======================
// Jobs
// =======================
export const getJobs = async (token) => {
  const res = await API.get("/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getEmployerJobs = (employerId, token) =>
  API.get(`/jobs?employerId=${employerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postJob = (data, token) =>
  API.post("/jobs", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editJob = (id, data, token) =>
  API.put(`/jobs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteJob = (id, token) =>
  API.delete(`/admin/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getJobById = (id) => API.get(`/jobs/${id}`);

export const applyToJob = (jobId, studentId, token) =>
  API.post(`/jobs/${jobId}/apply`, { studentId }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// =======================
// Gigs
// =======================
export const getGigs = async (token) => {
  const res = await API.get("/gigs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getEmployerGigs = (employerId, token) =>
  API.get("/gigs", {
    params: { employerId },
    headers: { Authorization: `Bearer ${token}` },
  });

export const postGig = (data, token) =>
  API.post("/gigs", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editGig = (id, data, token) =>
  API.put(`/gigs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteGig = (id, token) =>
  API.delete(`/admin/gigs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const applyToGig = (gigId, studentId, token) =>
  API.post(`/gigs/${gigId}/apply`, { studentId }, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Get applicants for a specific gig
export const getGigApplicants = (gigId, token) =>
  API.get(`/gigs/${gigId}/applicants`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Approve or deny a specific gig application
export const updateGigApplicationStatus = (appId, status, token) =>
  API.put(`/gigs/applications/${appId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });

//new methods
export const getGigById = async (id, token) => {
  const res = await axios.get(`/api/gigs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateGig = async (id, updatedData, token) => {
  const res = await axios.put(`/api/gigs/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// =======================
// Applications
// =======================
export const getStudentApplications = (studentId) =>
  API.get(`/profile/${studentId}/applications`);

// Get applicants for a specific job
export const getJobApplicants = (jobId, token) =>
  API.get(`/jobs/${jobId}/applicants`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Approve or deny a specific job application
export const updateJobApplicationStatus = (appId, status, token) =>
  API.put(`/jobs/applications/${appId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });


// =======================
// Upskill
// =======================
export const getUpskill = (token) =>
  API.get("/profile/upskill", {
    headers: { Authorization: `Bearer ${token}` },
  });

// =======================
// Admin Only
// =======================
export const getUsers = (token) =>
  API.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllJobs = (token) =>
  API.get("/admin/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllGigs = (token) =>
  API.get("/admin/gigs", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (id, token) =>
  API.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
