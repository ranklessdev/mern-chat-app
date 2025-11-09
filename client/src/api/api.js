import axios from "axios";

// This URL is derived from your server.js (Port 5000)
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api`,
});

export const setAuthToken = (token) => {
  if (token) {
    // Note: Your backend uses 'Authorization: Bearer <token>'
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
