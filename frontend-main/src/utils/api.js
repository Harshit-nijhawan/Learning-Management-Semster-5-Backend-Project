import axios from "axios";
import { getCookie, deleteCookie, getToken } from "./cookieUtils";

const api = axios.create({
  baseURL: "http://localhost:3001/api/auth",
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
    console.log("API Error:", error.response?.status, error.config?.url);

    if (error.response?.status === 401) {
      console.log("401 Unauthorized - clearing auth data");
      deleteCookie("token");
      deleteCookie("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
