import axios from "axios";

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",  // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // if you need to send cookies with the request
});

export default axiosInstance;
