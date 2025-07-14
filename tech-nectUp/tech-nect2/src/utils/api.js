const BASE_URL = "http://localhost:4000/api"; // Change if deployed

// Utility for parsing JSON safely
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ------------------ AUTH ------------------

// Register user (student or employer)
export async function registerUser(userData) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Registration failed.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Registration failed." };
  }
}

// Login user (student or employer)
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Login failed.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Login failed." };
  }
}

// ------------------ PROFILE ------------------

// Get current user profile (student or employer)
export async function getProfile(token) {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch profile.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch profile." };
  }
}

// Update profile
export async function updateProfile(profileData, token) {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to update profile.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to update profile." };
  }
}

// Upload profile picture (student or employer)
export async function uploadProfilePicture(file, token) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/profile/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Upload failed.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Upload failed." };
  }
}

// ------------------ JOBS ------------------

// Get all jobs (for students/general)
export async function getJobs(token) {
  try {
    const res = await fetch(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch jobs.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch jobs." };
  }
}

// Get a single job by ID
export async function getJobById(id, token) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch job.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch job." };
  }
}

// Apply to a job (for students)
export async function applyToJob(jobId, token) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Application failed.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Application failed." };
  }
}

// Get jobs posted by employer
export async function getEmployerJobs(token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch employer jobs.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch employer jobs." };
  }
}

// Post a new job (employer)
export async function postJob(jobData, token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to post job.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to post job." };
  }
}

// Edit a job (employer)
export async function editJob(jobId, jobData, token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to update job.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to update job." };
  }
}

// Delete a job (employer)
export async function deleteJob(jobId, token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to delete job.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to delete job." };
  }
}

// ------------------ GIGS ------------------

// Get all gigs (for students)
export async function getGigs(token) {
  try {
    const res = await fetch(`${BASE_URL}/gigs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch gigs.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch gigs." };
  }
}

// Get gigs posted by employer
export async function getEmployerGigs(token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/gigs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch employer gigs.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch employer gigs." };
  }
}

// Post a new gig (employer)
export async function postGig(gigData, token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/gigs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gigData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to post gig.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to post gig." };
  }
}

// Edit a gig (employer)
export async function editGig(gigId, gigData, token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/gigs/${gigId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gigData),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Failed to update gig.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Failed to update gig." };
  }
}

// ------------------ UPSKILL ------------------

// Get upskill recommendations for student
export async function getUpskill(token) {
  try {
    const res = await fetch(`${BASE_URL}/upskill`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch upskill recommendations.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch upskill recommendations." };
  }
}

// ------------------ APPLICATIONS ------------------

// Student: get my applications
export async function getStudentApplications(token) {
  try {
    const res = await fetch(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch applications.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch applications." };
  }
}

// Employer: get applicants for my jobs
export async function getEmployerApplicants(token) {
  try {
    const res = await fetch(`${BASE_URL}/employer/applicants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch applicants.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch applicants." };
  }
}

// ------------------ ADMIN ------------------

// Admin dashboard stats (users, jobs, gigs, applications, etc)
export async function getAdminStats(token) {
  try {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Could not fetch stats.");
    return data;
  } catch (err) {
    return { success: false, message: err.message || "Could not fetch stats." };
  }
}
