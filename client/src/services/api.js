import axios from "axios";

const api = axios.create({
  baseURL: "https://findmate-react-production.up.railway.app",
});

export default api;
