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
            setLoading(false);
        } catch (error) {
            setError('Error fetching bookings');
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            console.log('Updating booking status:', { bookingId, newStatus });
            const response = await API.put(`/api/booking/update/${bookingId}`, {
                status: newStatus
            });
            console.log('Status update response:', response.data);

            if (response.data.success) {
                // If booking is confirmed, delete the associated vacancy
                if (newStatus === 'confirmed') {
                    const booking = bookings.find(b => b._id === bookingId);
                    if (booking && booking.vacancyId) {
                        try {
                            await API.delete(`/api/vacancyroute/delete/${booking.vacancyId}`);
                            console.log('Vacancy deleted successfully');
                        } catch (error) {
                            console.error('Error deleting vacancy:', error);
                        }
                    }
                }
                
                // Update the local state
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking._id === bookingId
                            ? { ...booking, status: newStatus }
                            : booking
                    )
                );
                alert(`Booking ${newStatus} successfully`);
                // Refresh bookings list
                fetchBookings();
            } else {
                throw new Error(response.data.message || 'Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Error updating booking status: ' + (error.response?.data?.message || error.message));
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
                                    <p><strong>Mess Name:</strong> {booking.messName}</p>
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