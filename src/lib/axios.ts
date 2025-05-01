import axios from "axios";
// This function fetches data from the API
//
const API_BASE_URL = "http://localhost:8000/api/"

const apiRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;
