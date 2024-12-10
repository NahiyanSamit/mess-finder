const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error:', err));

// API routes
app.use("/api", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});