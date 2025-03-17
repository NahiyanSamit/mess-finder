import React, { useState, useEffect } from 'react';
import API from '../api/api';

const BookingModal = ({ closeModal, vacancy, userEmail, userType }) => {
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [transactionId, setTransactionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [messDetails, setMessDetails] = useState(null);

    useEffect(() => {
        const fetchMessDetails = async () => {
            try {
                console.log('Fetching mess details for:', vacancy.messManagerEmail);
                const response = await API.get(`/api/messroute/user/${vacancy.messManagerEmail}`);
                console.log('Mess details response:', response.data);
                if (response.data.success && response.data.mess) {
                    setMessDetails(response.data.mess);
                } else {
                    console.error('No mess details found in response:', response.data);
                    setErrorMessage('Unable to fetch mess details. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching mess details:', error);
                setErrorMessage('Error fetching mess details. Please try again.');
            }
        };

        if (vacancy.messManagerEmail) {
            fetchMessDetails();
        }
    }, [vacancy.messManagerEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userType === "messManager") {
            alert("Mess managers cannot make bookings");
            return;
        }

        // Validate all required fields
        if (!messDetails?.messName) {
            setErrorMessage("Missing mess name. Please try again.");
            return;
        }

        if (!vacancy?._id) {
            setErrorMessage("Invalid vacancy information. Please try again.");
            return;
        }

        if (!transactionId.trim()) {
            setErrorMessage("Please enter a transaction ID.");
            return;
        }

        if (!userEmail) {
            setErrorMessage("User email is required.");
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Create booking data with all required fields
            const bookingData = {
                userEmail,
                messId: vacancy._id,
                messName: messDetails.messName,
                messManagerEmail: vacancy.messManagerEmail,
                vacancyId: vacancy._id,
                amount: Number(vacancy.price),
                paymentMethod,
                transactionId: transactionId.trim(),
                status: 'pending',
                bookingDate: new Date().toISOString(),
                address: vacancy.address || messDetails.address,
                district: String(vacancy.district || messDetails.district), // Convert to string
                upazila: String(vacancy.upazila || messDetails.upazila), // Convert to string
                totalOccupants: vacancy.totalOccupants || 1 // Add totalOccupants
            };

            // Validate all required fields are present and have correct types
            const requiredFields = [
                'userEmail', 'messId', 'messName', 'messManagerEmail', 
                'vacancyId', 'amount', 'paymentMethod', 'transactionId'
            ];

            const missingFields = requiredFields.filter(field => !bookingData[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Log the complete booking data
            console.log('Complete booking data:', JSON.stringify(bookingData, null, 2));

            // Make the API call
            const response = await API.post("/api/booking/create", bookingData);
            console.log('Booking response:', response.data);

            if (response.data.success) {
                setSuccessMessage('Booking request sent successfully!');
                // Delete the vacancy after successful booking
                try {
                    await API.delete(`/api/vacancyroute/delete/${vacancy._id}`);
                    console.log('Vacancy deleted successfully');
                } catch (deleteError) {
                    console.error('Error deleting vacancy:', deleteError);
                }
                setTimeout(() => {
                    closeModal();
                    window.location.reload(); // Refresh the page to update the vacancy list
                }, 2000);
            } else {
                throw new Error(response.data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            if (error.response) {
                console.error("Server error response:", error.response.data);
                setErrorMessage(error.response.data.message || "Server error. Please try again.");
            } else if (error.request) {
                console.error("No response received:", error.request);
                setErrorMessage("No response from server. Please check your connection.");
            } else {
                console.error("Error details:", error.message);
                setErrorMessage(error.message || "Failed to create booking. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Book Mess</h2>
                <div className="mb-4">
                    <h3 className="font-semibold">Booking Details:</h3>
                    <p>Mess Name: {messDetails?.messName || 'Loading...'}</p>
                    <p>Price: ৳{vacancy.price}</p>
                    <p>Location: {vacancy.address || messDetails?.address}</p>
                    <p>Room Type: {vacancy.totalOccupants === 1 ? 'Single' : `Shared (${vacancy.totalOccupants} Person)`}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Transaction ID</label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your transaction ID"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            For demo purposes, you can enter any transaction ID
                        </p>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={isProcessing || !messDetails?.messName}
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;