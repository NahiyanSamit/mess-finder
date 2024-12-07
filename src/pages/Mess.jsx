import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Mess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const mess = state?.mess; // Retrieve the mess details from the passed state

    // If no mess data is available, display a message
    if (!mess) {
        return (
            <div className="text-center mt-10">
                <p className="text-gray-500 text-xl">
                    No mess details available.
                </p>
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div>
            < Header />
            <div className="max-w-4xl mx-auto mt-32 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {mess.name}
                </h1>
                <p className="text-lg text-gray-700 mb-2">
                    <span className="font-semibold">Location:</span>{" "}
                    {mess.district}, {mess.upazila}
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    <span className="font-semibold">Details:</span>{" "}
                    {mess.details}
                </p>
                <button
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export { Mess };
