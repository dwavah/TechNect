import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
