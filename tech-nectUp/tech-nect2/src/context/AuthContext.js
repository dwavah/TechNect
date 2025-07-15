// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // SAFELY parse localStorage, catch any errors
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    if (!u) return null;
    try {
      return JSON.parse(u);
    } catch (err) {
      localStorage.removeItem("user"); // remove corrupted value
      return null;
    }
  });

  const login = (data) => {
  const userWithToken = {
    ...data.user,
    _id: data.user._id || data.user.id, // support either key
    token: data.token,
  };
  setUser(userWithToken);
  localStorage.setItem("user", JSON.stringify(userWithToken));
  localStorage.setItem("token", data.token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
