import axios from "axios";

// Create an Axios instance with a base URL and default configurations
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds timeout
});

// Add an interceptor for attaching tokens or additional headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Example GET request
export const fetchData = async () => {
    try {
        const response = await API.get("/example");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error.response?.data || { message: "An unexpected error occurred" };
    }
};

// Example POST request
export const postData = async (data) => {
    try {
        const response = await API.post("/example", data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error.response?.data || error.message);
        throw error.response?.data || { message: "An unexpected error occurred" };
    }
};

export default API;
