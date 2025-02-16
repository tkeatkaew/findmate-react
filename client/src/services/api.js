import axios from "axios";

const api = axios.create({
  baseURL: "findmate-react-production.up.railway.app",
});

export default api;
