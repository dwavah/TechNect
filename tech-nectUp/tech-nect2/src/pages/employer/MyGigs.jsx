import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { BriefcaseIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Navbar from "../../components/Navbar";
import {
  getEmployerGigs,
  getGigApplicants,
  updateGigApplicationStatus,
} from "../../utils/api";
import toast from "react-hot-toast";

export default function MyGigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGigId, setSelectedGigId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const fetchGigs = async () => {
    if (!user?.id && !user?._id) return;
    try {
      const employerId = user._id || user.id;
      const data = await getEmployerGigs(employerId, user.token);
      setGigs(data);
    } catch (err) {
      toast.error("Failed to fetch gigs.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (gigId) => {
    if (selectedGigId === gigId) {
      setSelectedGigId(null);
      setApplicants([]);
      return;
    }

    try {
      const data = await getGigApplicants(gigId, user.token);
      setSelectedGigId(gigId);
      setApplicants(data);
    } catch (err) {
      toast.error("Failed to load applicants.");
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateGigApplicationStatus(applicationId, newStatus, user.token);
      toast.success(`Application ${newStatus}`);
      if (selectedGigId) {
        const refreshed = await getGigApplicants(selectedGigId, user.token);
        setApplicants(refreshed);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-yellow-800">
            <BriefcaseIcon className="w-6 h-6" />
            My Gigs
          </h2>
          <Link
            to="/employer/gigs/new"
            className="bg-yellow-700 text-white px-4 py-2 rounded-2xl flex items-center gap-1 hover:bg-yellow-600"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Post Gig
          </Link>
        </div>

        {loading ? (
          <div>Loading gigs...</div>
        ) : gigs.length === 0 ? (
          <div className="text-gray-500">You haven’t posted any gigs yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-yellow-100 text-yellow-900">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Applicants</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => (
                  <React.Fragment key={gig.id}>
                    <tr className="border-b">
                      <td className="py-2 px-4">{gig.title}</td>
                      <td className="py-2 px-4">{gig.publish_status}</td>
                      <td className="py-2 px-4">
                        <button
                          className="text-blue-700 hover:underline"
                          onClick={() => handleViewApplicants(gig.id)}
                        >
                          {selectedGigId === gig.id
                            ? "Hide"
                            : "View Applicants"}
                        </button>
                      </td>
                      <td className="py-2 px-4 space-x-2">
                        <Link
                          to={`/employer/gigs/${gig.id}/edit`}
                          className="text-yellow-700 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>

                    {selectedGigId === gig.id && (
                      <tr>
                        <td colSpan="4" className="bg-gray-50 px-4 py-3">
                          {applicants.length === 0 ? (
                            <div className="text-gray-500">
                              No applicants yet.
                            </div>
                          ) : (
                            <ul className="space-y-2 text-sm">
                              {applicants.map((a) => (
                                <li
                                  key={a.id}
                                  className="flex justify-between items-center"
                                >
                                  <div>
                                    <span className="font-medium">
                                      {a.name}
                                    </span>{" "}
                                    — {a.email} —{" "}
                                    <span className="italic">
                                      {a.university || "N/A"}
                                    </span>{" "}
                                    — Status:{" "}
                                    <span className="font-semibold">
                                      {a.GigApplication?.status}
                                    </span>
                                  </div>
                                  <div className="space-x-2">
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          a.GigApplication?.id,
                                          "approved"
                                        )
                                      }
                                      className="text-green-700 hover:underline"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          a.GigApplication?.id,
                                          "denied"
                                        )
                                      }
                                      className="text-red-600 hover:underline"
                                    >
                                      Deny
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
