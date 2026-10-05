import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const AUTH_API_URL = `${API_BASE_URL}/auth`;
export const MAIN_API_URL = `${API_BASE_URL}/api`;

// Helper to decode JWT payload safely
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    }
  } catch (err) {
    console.warn("Error decoding token:", err);
  }
  return null;
};

// Helper to get authenticated user data from token and localStorage
export const getAuthUser = () => {
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);

  const role = decoded?.role || localStorage.getItem("role") || "employee";
  const name = decoded?.name || localStorage.getItem("name") || "User";
  const email = decoded?.email || localStorage.getItem("email") || "";
  const id = decoded?._id || "";

  return { token, role: role.toLowerCase(), name, email, id };
};

// Axios instance with token interceptor
export const apiClient = axios.create({
  baseURL: MAIN_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401/403 access denied
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    }
    return Promise.reject(error);
  }
);
