const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Account = require("../models/Account");
const Vacancy = require("../models/Vacancy");

// Create a new booking
router.post("/create", async (req, res) => {
    try {
        const {
            userEmail,
            messId,
            messName,
            vacancyId,
            messManagerEmail,
            amount,
            paymentMethod,
            transactionId
        } = req.body;

        console.log('Received booking data:', req.body);

        // Check if user exists and is not a mess manager
        const user = await Account.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.userType === "messManager") {
            return res.status(403).json({
                success: false,
                message: "Mess managers cannot book a mess"
            });
        }

        // Check if vacancy exists and is available
        const vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).json({
                success: false,
                message: "Vacancy not found"
            });
        }

        // Create new booking with all required fields
        const newBooking = new Booking({
            userId: user._id,
            userEmail,
            messId,
            messName,
            vacancyId,
            messManagerEmail,
            amount,
            paymentMethod,
            transactionId,
            status: 'pending',
            paymentStatus: 'pending'
        });

        console.log('Creating new booking:', newBooking);

        await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating booking"
        });
    }
});

// Get bookings for a user
router.get("/user/:email", async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email });
        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings"
        });
    }
});

// Get bookings for a mess manager
router.get("/manager/:email", async (req, res) => {
    try {
        const bookings = await Booking.find({ messManagerEmail: req.params.email });
        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings"
        });
    }
});

// Update booking status
router.put("/update/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({
            success: false,
            message: "Error updating booking"
        });
    }
});

module.exports = router; 