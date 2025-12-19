import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // change if deployed
});

/* ================= EXISTING APIS (UNCHANGED) ================= */
export const getDashboardStats = () => API.get("/dashboard");
export const getExpiryAlerts = () => API.get("/expiry");
export const getForecast = () => API.get("/forecast");
export const getReorderSuggestions = () => API.get("/reorder");
export const askChatbot = (question) =>
  API.post("/chatbot", { question });

/* ================= ✅ NEW API (REAL DATA) ================= */
/* This matches backend route: /dashboard-stats */
export const getRealDashboardStats = () =>
  API.get("/dashboard-stats");

export default API;
