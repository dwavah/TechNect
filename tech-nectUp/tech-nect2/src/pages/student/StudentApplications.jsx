import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentApplications } from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState({ jobs: [], gigs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      try {
        const data = await getStudentApplications(user.id);
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">My Applications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Jobs</h3>
              {applications.jobs.length === 0 ? (
                <p className="text-gray-600">You haven’t applied for any jobs yet.</p>
              ) : (
                <ul className="space-y-2">
                  {applications.jobs.map((app) => (
                    <li key={app.id} className="border p-4 rounded bg-white shadow">
                      <div className="font-semibold text-blue-900">{app.job?.title}</div>
                      <div className="text-sm text-gray-600">
                        Status:{" "}
                        <span className={`font-medium ${app.status === 'approved' ? 'text-green-600' : app.status === 'denied' ? 'text-red-600' : 'text-yellow-700'}`}>
                          {app.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Gigs</h3>
              {applications.gigs.length === 0 ? (
                <p className="text-gray-600">You haven’t applied for any gigs yet.</p>
              ) : (
                <ul className="space-y-2">
                  {applications.gigs.map((app) => (
                    <li key={app.id} className="border p-4 rounded bg-white shadow">
                      <div className="font-semibold text-blue-900">{app.gig?.title}</div>
                      <div className="text-sm text-gray-600">
                        Status:{" "}
                        <span className={`font-medium ${app.status === 'approved' ? 'text-green-600' : app.status === 'denied' ? 'text-red-600' : 'text-yellow-700'}`}>
                          {app.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
