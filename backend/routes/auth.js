const express = require("express");
const Account = require("../models/Account");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password, userType, phone } = req.body;

    // Check if the email already exists
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    // Store plain-text password (for debugging only)
    const newAccount = new Account({
        username,
        email,
        password, // Store plain-text password temporarily
        userType,
        phone,
    });

    try {
        await newAccount.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving account", error });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Account.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            });
        }

        // Directly compare plain-text passwords
        if (user.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;