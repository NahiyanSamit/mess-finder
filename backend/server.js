const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const messRoutes = require("./routes/messroute");
const occupantRoutes = require("./routes/occupantroute");
const vacancyRoutes = require("./routes/vacancyroute");
const bookingRoutes = require("./routes/bookingRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messroute", messRoutes);
app.use("/api/occupantroute", occupantRoutes);
app.use("/api/vacancyroute", vacancyRoutes);
app.use("/api/booking", bookingRoutes);
app.use('/api/upload', require('./routes/upload'));

// Debug middleware for routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 404 Error Handling
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route not found" });
});

// General Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Graceful Shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server...");
    mongoose.connection.close(() => {
        console.log("MongoDB connection closed.");
        process.exit(0);
    });
});

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
