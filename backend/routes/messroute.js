const express = require("express");
const Mess = require("../models/Mess");
const router = express.Router();

// Save occupant details
router.post("/add", async (req, res) => {
    const { managerEmail, messName, messType, address, upazila, district, totalRooms } = req.body;

    const newMess = new Mess({
        managerEmail,
        messName,
        messType,
        address,
        upazila,
        district,
        totalRooms
    });

    try {
        await newMess.save();
        res.status(201).json({ message: "Mess added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving mess", error });
    }
});

module.exports = router;