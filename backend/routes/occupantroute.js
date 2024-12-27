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

module.exports = router;