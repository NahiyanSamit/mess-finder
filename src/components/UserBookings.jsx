import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import districts from '../components/districts.json';
import upazilas from '../components/upazilas.json';

const UserBookings = ({ userEmail }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [messDetails, setMessDetails] = useState({});

    const getDistrictName = (districtId) => {
        const district = districts.find((d) => d.id === districtId);
        return district ? district.name : "Unknown District";
    };

    const getUpazilaName = (upazilaId) => {
        const upazila = upazilas.find((u) => u.id === upazilaId);
        return upazila ? upazila.name : "Unknown Upazila";
    };

    const getMessLocation = (mess) => {
        if (!mess) return 'N/A';
        return `${mess.address}, ${getUpazilaName(mess.upazila)}, ${getDistrictName(mess.district)}`;
    };

    useEffect(() => {
        fetchBookings();
    }, [userEmail]);

    const fetchBookings = async () => {
        try {
            const response = await API.get(`/api/booking/user/${userEmail}`);
            if (response.data.success) {
                const bookingsData = response.data.bookings;
                console.log('Detailed booking data:', JSON.stringify(bookingsData, null, 2));
                setBookings(bookingsData);
                
                // Fetch mess details for each booking
                for (const booking of bookingsData) {
                    try {
                        console.log('Fetching mess details for booking:', booking);
                        const messResponse = await API.get(`/api/messroute/user/${booking.messManagerEmail}`);
                        console.log('Mess response:', messResponse.data);
                        if (messResponse.data.success && messResponse.data.mess) {
                            setMessDetails(prev => ({
                                ...prev,
                                [booking.messId]: messResponse.data.mess
                            }));
                        }
                    } catch (error) {
                        console.error('Error fetching mess details:', error);
                        console.error('Failed booking:', booking);
                    }
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const getMessName = (booking) => {
        if (!booking.messManagerEmail) {
            console.log('No messManagerEmail in booking:', booking);
            return 'Loading...';
        }
        const messDetail = messDetails[booking.messId];
        if (!messDetail) {
            return 'Loading...';
        }
        return messDetail.messName || 'N/A';
    };

    const generateInvoice = async (booking) => {
        if (generatingPdf) return;
        setGeneratingPdf(true);

        try {
            const messName = getMessName(booking);
            const messDetail = messDetails[booking.messId];
            const messAddress = getMessLocation(messDetail);
            
            // Create new PDF document with explicit configuration
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            // Set up page dimensions
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;

            // Header
            doc.setFont('helvetica');
            doc.setFontSize(20);
            const title = 'Mess Finder - Booking Invoice';
            const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize();
            doc.text(title, (pageWidth - titleWidth) / 2, margin);

            // Table data
            const tableData = [
                ['Booking ID', booking._id || 'N/A'],
                ['Mess Name', messName],
                ['Mess Address', messAddress],
                ['Amount', booking.amount ? `৳${booking.amount}` : 'N/A'],
                ['Payment Method', booking.paymentMethod ? booking.paymentMethod.toUpperCase() : 'N/A'],
                ['Transaction ID', booking.transactionId || 'N/A'],
                ['Booking Date', booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'],
                ['Status', booking.status ? booking.status.toUpperCase() : 'N/A'],
            ];

            // Generate table
            autoTable(doc, {
                startY: margin + 30,
                head: [['Item', 'Details']],
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 12,
                    cellPadding: 8,
                    overflow: 'linebreak',
                    font: 'helvetica'
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 14
                },
                columnStyles: {
                    0: { fontStyle: 'bold' }
                },
                margin: { top: margin }
            });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(128);
            const footer = 'Generated by Mess Finder';
            const footerWidth = doc.getStringUnitWidth(footer) * doc.internal.getFontSize();
            doc.text(footer, (pageWidth - footerWidth) / 2, pageHeight - margin);

            // Save the document
            const filename = `booking-invoice-${Date.now()}.pdf`;
            doc.save(filename);
            
            console.log('PDF generation completed successfully');
        } catch (error) {
            console.error('Detailed error in PDF generation:', error);
            alert(`Error generating invoice: ${error.message}`);
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading bookings...</div>;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p><strong>Mess:</strong> {getMessName(booking)}</p>
                                    <p><strong>Amount:</strong> ৳{booking.amount}</p>
                                    <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
                                    <p><strong>Transaction ID:</strong> {booking.transactionId}</p>
                                    <p>
                                        <strong>Booking Status:</strong>{" "}
                                        <span className={`font-semibold ${
                                            booking.status === 'confirmed' ? 'text-green-600' :
                                            booking.status === 'cancelled' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </p>
                                    <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                </div>
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => generateInvoice(booking)}
                                        disabled={generatingPdf}
                                        className={`${
                                            generatingPdf 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white px-4 py-2 rounded transition-colors duration-200`}
                                    >
                                        {generatingPdf ? 'Generating...' : 'Download Invoice'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings; 