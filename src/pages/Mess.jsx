import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import districts from "../components/districts.json";
import upazilas from "../components/upazilas.json";
import BookingModal from "../components/BookingModal";
import API from "../api/api";

function Mess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [managerDetails, setManagerDetails] = useState(null);
    
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail = storedUser?.email;
    const userType = storedUser?.userType;

    // retrieve mess data from location state
    const mess = location.state?.mess;

    useEffect(() => {
        const fetchManagerDetails = async () => {
            try {
                const response = await API.get(`http://localhost:5000/api/auth/user/${mess.messManagerEmail}`);
                if (response.data.success) {
                    setManagerDetails(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching manager details:", error);
            }
        };

        if (mess?.messManagerEmail) {
            fetchManagerDetails();
        }
    }, [mess?.messManagerEmail]);

    const getMessLocation = (mess) => {
        return `${mess.address}, ${getUpazilaName(
            mess.upazila
        )}, ${getDistrictName(mess.district)}`;
    };

    const getDistrictName = (districtId) => {
        const district = districts.find((d) => d.id === districtId);
        return district ? district.name : "Unknown District";
    };
    const getUpazilaName = (upazilaId) => {
        const upazila = upazilas.find((u) => u.id === upazilaId);
        return upazila ? upazila.name : "Unknown Upazila";
    };
    const getRoomType = (totalOccupants) => {
        return totalOccupants === 1 ? "Single" : "Shared";
    };

    const getPaymentMethods = (details) => {
        if (!details || !details.paymentMethods) return '';
        
        const methods = [];
        if (details.paymentMethods.bkash.enabled) methods.push('bKash');
        if (details.paymentMethods.nagad.enabled) methods.push('Nagad');
        if (details.paymentMethods.rocket.enabled) methods.push('Rocket');
        
        return methods.length > 0 ? `(${methods.join('/')})` : '';
    };

    const handleBooking = () => {
        if (!userEmail) {
            // Redirect to login if user is not logged in
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        setShowBookingModal(true);
    };

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto mt-32 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold mb-4">{mess.messName}</h1>
                <p className="text-gray-700">
                    <span className="underline">Address:</span>{" "}
                    {getMessLocation(mess)}
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="underline">Price:</span> ৳{mess.price}
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="underline">Mess Type:</span>{" "}
                    {mess.messType}
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="underline">Room Type:</span>{" "}
                    {getRoomType(mess.totalOccupants) + " (" + mess.totalOccupants + " Person)"}
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="underline">Contact:</span>{" "}
                    <a href={`mailto:${mess.messManagerEmail}`} className="text-blue-600 hover:underline">
                        {mess.messManagerEmail}
                    </a>
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="underline">Phone & Payment:</span>{" "}
                    {managerDetails?.phone} {managerDetails && getPaymentMethods(managerDetails)}
                </p>

                {/* Line break */}
                <hr className="my-4" />

                {/* Description of the mess */}
                <p className="text-gray-600 mt-2">
                    <span className="underline">Description:</span> {mess.messDescription}
                </p>

                {/* Images of the mess */}
                <div className="mt-4 flex flex-wrap gap-4">
                    {mess.images?.map((image, index) => (
                        <img 
                            key={index}
                            src={image} 
                            alt={`Mess ${index + 1}`} 
                            className="w-96 h-80 object-cover rounded-lg" 
                        />
                    ))}
                    {/* Line break */}
                    <hr className="my-4 w-full" /> 
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Go Back
                    </button>
                    {userType !== "messManager" && (
                        <button
                            onClick={handleBooking}
                            className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Book Now
                        </button>
                    )}
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    closeModal={() => setShowBookingModal(false)}
                    vacancy={mess}
                    userEmail={userEmail}
                    userType={userType}
                    managerDetails={managerDetails}
                />
            )}
        </div>
    );
}

export { Mess };
