import axios from "axios";

// Create an Axios instance with the base URL for the backend
const API = axios.create({
  baseURL: "http://localhost:5001/api", // Replace with your backend URL if different
});

// Add a request interceptor to include the Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
