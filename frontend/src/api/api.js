import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // change if deployed
});

export const getDashboardStats = () => API.get("/dashboard");
export const getExpiryAlerts = () => API.get("/expiry");
export const getForecast = () => API.get("/forecast");
export const getReorderSuggestions = () => API.get("/reorder");
export const askChatbot = (question) =>
  API.post("/chatbot", { question });

export default API;
