import axios from "axios";

const api = axios.create({
  baseURL: "https://findmate-react-production.up.railway.app",
});

// Add a request interceptor to include JWT token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If unauthorized or token expired
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear local storage and redirect to login page
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Check if we're already on the login page to avoid redirect loops
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
