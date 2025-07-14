import React, { useState } from "react";
export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [dark, setDark] = useState(false);

return (
  <>
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="mb-4 flex items-center justify-between">
        <span>Theme:</span>
        <select value={theme} onChange={e => setTheme(e.target.value)} className="border p-2 rounded">
          <option value="light">Light</option>
          <option value="dark">Dark (coming soon)</option>
        </select>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span>Enable notifications:</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(n => !n)}
        />
      </div>
      <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">
        Save Preferences
      </button>
    </div>
    <button onClick={()=>setDark(d=>!d)}>
      {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
    <div className={dark ? "bg-gray-900 text-white" : ""}>
      {/* rest of your settings */}
    </div>
  </>
);
}
