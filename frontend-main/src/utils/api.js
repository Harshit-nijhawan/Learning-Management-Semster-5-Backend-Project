import axios from "axios";
import { getCookie, deleteCookie, getToken } from "./cookieUtils";

// FIX: Use environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL, // Now points to /api, not /api/auth
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      deleteCookie("token");
      deleteCookie("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;