import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MessDetails } from "../components/MessDetails";
import { Link } from "react-router-dom";
import API from "../api/api";


export function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showMessDetails, setMessDetails] = useState(false);
    const [hasMess, setHasMess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Retrieve user data from location state
    const { username, email, userType } = location.state || {};

    // Fallback to localStorage if state is unavailable
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const usernameFromStorage = username || storedUser?.username;
    const emailFromStorage = email || storedUser?.email;
    const userTypeFromStorage = userType || storedUser?.userType;

    useEffect(() => {
        // Check if the user has a mess in the database
        const fetchMessData = async () => {
            try {
                const response = await API.get(
                    `http://localhost:5000/api/messroute/user/${emailFromStorage}`
                );
                if (response.data.success && response.data.mess) {
                    setHasMess(true);
                    console.log("Mess data:", response.data.mess);
                }
            } catch (error) {
                console.error("Error fetching mess data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (emailFromStorage) {
            fetchMessData();
        }
    }, [emailFromStorage]);
    

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const addMessDetails = () => setMessDetails(!showMessDetails);

    return (
        <div className="relative flex flex-col">
            <div className="absolute top-4 left-4">
                <Link
                    to="/"
                    className="text-3xl font-bold text-gray-800 hover:text-blue-500"
                >
                    Mess Finder
                </Link>
            </div>
            <div className="profile-page max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <div className="profile-header flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, {usernameFromStorage}!
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="logout-btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                <div className="profile-details">
                    <div className="profile-info bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Profile Information
                        </h2>
                        <p className="text-gray-600 mb-2">
                            <strong className="text-gray-800">Email:</strong>{" "}
                            {emailFromStorage}
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-gray-800">Bio:</strong>{" "}
                            {userTypeFromStorage}
                        </p>
                    </div>
                </div>
                {userTypeFromStorage === "messManager" && (
                    <div className="flex justify-center mt-4">
                        {!loading && (
                            <button
                                onClick={addMessDetails}
                                className={`add-mess-button py-2 px-4 rounded ${
                                    hasMess
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                                disabled={hasMess}
                            >
                                {hasMess ? "Mess Already Added" : "Add Mess"}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Toggle modal */}
            {showMessDetails && <MessDetails closeModal={addMessDetails} />}
        </div>
    );
}

export default Profile;
