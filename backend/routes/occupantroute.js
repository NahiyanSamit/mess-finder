const express = require("express");
const Occupant = require("../models/Occupants");
const router = express.Router();

// Save occupant details
router.post("/add", async (req, res) => {
    const { name, age, phone, managerEmail, roomNo } = req.body;

    const newOccupant = new Occupant({
        name,
        age,
        phone,
        managerEmail,
        roomNo,
    });

    try {
        await newOccupant.save();
        res.status(201).json({ message: "Occupant added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving occupant", error });
    }
});

// Get occupants by manager email
router.get("/user/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const occupants = await Occupant.find({ managerEmail: email });
        if (occupants) {
            res.status(200).json({ success: true, occupants });
        } else {
            res.status(200).json({ success: true, occupants: [] });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching occupants", error });
    }
});

module.exports = router;