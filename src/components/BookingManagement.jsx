import React, { useState, useEffect } from 'react';
import API from '../api/api';

const BookingManagement = ({ messManagerEmail }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [messManagerEmail]);

    const fetchBookings = async () => {
        try {
            const response = await API.get(`/api/booking/manager/${messManagerEmail}`);
            if (response.data.success) {
                setBookings(response.data.bookings);
            }
        } catch (error) {
            setError('Error fetching bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const response = await API.put(`/api/booking/update/${bookingId}`, {
                status: newStatus
            });
            if (response.data.success) {
                // Refresh bookings after update
                fetchBookings();
            }
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Booking Requests</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p><strong>User:</strong> {booking.userEmail}</p>
                                    <p><strong>Amount:</strong> ৳{booking.amount}</p>
                                    <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
                                    <p><strong>Transaction ID:</strong> {booking.transactionId}</p>
                                    <p><strong>Status:</strong> <span className={`font-semibold ${
                                        booking.status === 'confirmed' ? 'text-green-600' :
                                        booking.status === 'cancelled' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>{booking.status}</span></p>
                                    <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                </div>
                                {booking.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingManagement; 