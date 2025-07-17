import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Users
export const getUsers = (token) =>
  API.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteUser = (id, token) =>
  API.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Jobs
export const getJobs = (token) =>
  API.get("/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
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
export const applyToJob = (id, studentId) =>
  API.post(`/jobs/${id}/apply`, { studentId });

// Gigs
export const getGigs = (token) =>
  API.get("/gigs", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getEmployerGigs = (employerId, token) =>
  API.get(`/gigs?employerId=${employerId}`, {
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

// Applications
export const getStudentApplications = (studentId) =>
  API.get(`/profile/${studentId}/applications`);

// Upskill (if you have this endpoint)
export const getUpskill = () => API.get("/profile/upskill");
