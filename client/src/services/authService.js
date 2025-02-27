import axios from "./api";

// Token key in localStorage
const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

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

// Set user info in localStorage
const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user info from localStorage
const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove user info from localStorage
const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Login user
const login = async (email, password) => {
  try {
    const response = await axios.post("/login", { email, password });
    const { token, user } = response.data;

    // Save token and user in localStorage
    setToken(token);
    setUser(user);

    // Set auth token for all future requests
    setAuthHeader(token);

    return { success: true, user };
  } catch (error) {
    throw error.response ? error.response.data : { error: "Network error" };
  }
};

// Logout user
const logout = () => {
  // Remove token and user from localStorage
  removeToken();
  removeUser();

  // Remove auth header
  removeAuthHeader();

  // Optional: notify server about logout (not necessary for JWT)
  axios.post("/logout").catch((err) => console.error("Logout error:", err));
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
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
  if (token) {
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
  setUser,
  initializeAuth,
};

export default authService;
