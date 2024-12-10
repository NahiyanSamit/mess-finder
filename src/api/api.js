import axios from "axios";

// Create an Axios instance with a base URL
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // Use an environment variable for better flexibility
});

// Example GET request
export const fetchData = async () => {
    try {
        const response = await API.get("/example");
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw error to handle it in the component
    }
};

// Example POST request
export const postData = async (data) => {
    try {
        const response = await API.post("/example", data);
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Error posting data:", error);
        throw error; // Re-throw error to handle it in the component
    }
};

export default API;
