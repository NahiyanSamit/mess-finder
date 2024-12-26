const express = require("express");
const crypto = require("crypto");
const Account = require("../models/Account");
const router = express.Router();

// Utility functions for password hashing
const encryptPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return { salt, hash };
};

const verifyPassword = (password, salt, hash) => {
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === hashToVerify;
};

// Register Route
router.post("/register", async (req, res) => {
    const { username, email, password, userType, phone } = req.body;

    // Check if the email already exists
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt the password
    const { salt, hash } = encryptPassword(password);

    const newAccount = new Account({
        username,
        email,
        password: hash, // Store the hashed password
        salt, // Store the salt
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

// Login Route
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

        // Verify the password
        const isPasswordValid = verifyPassword(password, user.salt, user.password);
        if (!isPasswordValid) {
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
