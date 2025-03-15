const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    messId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mess',
        required: true,
    },
    vacancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: true,
    },
    messManagerEmail: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['bkash', 'nagad', 'rocket'],
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking; 