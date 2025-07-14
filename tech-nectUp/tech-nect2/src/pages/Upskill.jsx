import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUpskill } from "../utils/api";

export default function Upskill() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpskill() {
      setLoading(true);
      const data = await getUpskill(user.token);
      setSuggestions(data.suggestions || []);
      setLoading(false);
    }
    fetchUpskill();
  }, [user.token]);

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">Upskill Recommendations</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-disc pl-5 space-y-2 text-lg text-blue-800">
          {suggestions.length === 0
            ? <li>No suggestions at this time.</li>
            : suggestions.map((s, idx) => <li key={idx}>{s}</li>)
          }
        </ul>
      )}
    </section>
  );
}
