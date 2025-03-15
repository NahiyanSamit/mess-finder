import React, { useState } from 'react';
import API from '../api/api';

const BookingModal = ({ closeModal, vacancy, userEmail, userType }) => {
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [transactionId, setTransactionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsProcessing(true);

        // Check if user is a mess manager
        if (userType === 'messManager') {
            setErrorMessage('Mess managers cannot book a mess');
            setIsProcessing(false);
            return;
        }

        try {
            const response = await API.post('/api/booking/create', {
                userEmail,
                messId: vacancy.messId || vacancy._id,
                vacancyId: vacancy._id,
                messManagerEmail: vacancy.messManagerEmail,
                amount: vacancy.price,
                paymentMethod,
                transactionId
            });

            if (response.data.success) {
                setSuccessMessage('Booking created successfully! Waiting for confirmation.');
                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Booking error:', error);
            setErrorMessage(error.response?.data?.message || 'Error creating booking. Please try again.');
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
                    <p>Mess Name: {vacancy.messName}</p>
                    <p>Price: ৳{vacancy.price}</p>
                    <p>Location: {vacancy.address}</p>
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
                            disabled={isProcessing}
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