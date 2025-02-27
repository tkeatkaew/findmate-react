import axios from "./api";
import { jwtDecode } from "jwt-decode";

// Token key in localStorage
const TOKEN_KEY = "auth_token";

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Get user info from JWT token
const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode JWT to get user info
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Login user
const login = async (email, password) => {
  try {
    const response = await axios.post("/login", { email, password });
    const { token } = response.data;

    if (!token) {
      throw new Error("No token received from server");
    }

    // Save token in localStorage
    setToken(token);

    // Set auth header for future requests
    setAuthHeader(token);

    return { success: true, user: jwtDecode(token) };
  } catch (error) {
    throw error.response ? error.response.data : { error: "Network error" };
  }
};

// Logout user
const logout = async () => {
  try {
    // Call the logout endpoint if needed
    await axios
      .post("/logout")
      .catch((err) => console.error("Logout error:", err));
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Remove token from localStorage
    removeToken();

    // Remove auth header
    removeAuthHeader();
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Verify token hasn't expired
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token expired, clean up
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token
    console.error("Token validation error:", error);
    removeToken();
    return false;
  }
};

// Set authorization header for axios
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Remove authorization header
const removeAuthHeader = () => {
  delete axios.defaults.headers.common["Authorization"];
};

// Initialize auth header from localStorage on app start
const initializeAuth = () => {
  const token = getToken();
  if (token && isAuthenticated()) {
    setAuthHeader(token);
    return true;
  }
  return false;
};

// Export auth functions
const authService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUser,
  initializeAuth,
};

export default authService;
