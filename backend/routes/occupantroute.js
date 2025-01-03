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
router.get("/room/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const occupant = await Occupant.find({ managerEmail: email });
        if (occupant) {
            res.status(200).json({ success: true, occupant });
        } else {
            res.status(200).json({ success: true, occupant: [] });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching occupants", error });
    }
});

// Delete occupant by id
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Occupant.findByIdAndDelete(id);
        res.status(200).json({ message: "Occupant deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting occupant", error });
    }
});

module.exports = router;