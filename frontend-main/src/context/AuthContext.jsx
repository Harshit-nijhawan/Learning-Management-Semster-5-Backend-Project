import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "../utils/cookieUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from both cookies and localStorage
  useEffect(() => {
    const storedToken = getCookie("token") || localStorage.getItem("token");
    const storedUser = getCookie("user") || localStorage.getItem("user");

    console.log("AuthContext: Initializing from storage", {
      cookieToken: !!getCookie("token"),
      localToken: !!localStorage.getItem("token"),
      cookieUser: !!getCookie("user"),
      localUser: !!localStorage.getItem("user"),
    });

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("AuthContext: User restored", userData.name);

          // Sync both storage methods
          setCookie("token", storedToken);
          setCookie("user", JSON.stringify(userData));
          localStorage.setItem("token", storedToken);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("AuthContext: Error parsing stored user data:", error);
          // Clear invalid user data from both storages
          deleteCookie("user");
          localStorage.removeItem("user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, userData) => {
    console.log("AuthContext: Logging in user", userData.name);
    setToken(newToken);
    setUser(userData);

    // Store in both cookies and localStorage for redundancy
    setCookie("token", newToken);
    setCookie("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("AuthContext: Logging out user");
    setToken(null);
    setUser(null);

    // Clear both storage methods
    deleteCookie("token");
    deleteCookie("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
