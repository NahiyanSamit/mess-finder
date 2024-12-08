// ./pages/Profile.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessDetails } from "../components/MessDetails";

export function Profile() {
    const navigate = useNavigate();

    const [showMessDetails, setMessDetails] = useState(false);

    const addMessDetails = () => setMessDetails(!showMessDetails);

    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel velit eu nunc luctus pharetra.",
    };

    const handleLogout = () => {
        // Perform the logout action (you can add logic for clearing authentication here)
        console.log("User logged out");
        navigate("/"); // Redirect to login page after logout
    };
    

    return (
        <div className="relative flex flex-col">
            <div className="absolute top-4 left-4">
                <a
                    href="/"
                    className="text-3xl font-bold text-gray-800 hover:text-blue-500"
                >
                    Mess Finder
                </a>
            </div>
            <div className="profile-page max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <div className="profile-header flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome, {user.name}!
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
                            {user.email}
                        </p>
                        <p className="text-gray-600">
                            <strong className="text-gray-800">Bio:</strong>{" "}
                            {user.bio}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center mt-4 h-full">
                    <button
                        onClick={addMessDetails}
                        className="add-mess-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Add Mess Details
                    </button>
                </div>
            </div>
            {/* Toogle modal */}
            {showMessDetails && <MessDetails closeModal={addMessDetails} />}
        </div>
    );
}

export default Profile;
