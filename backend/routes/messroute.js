const express = require("express");
const Mess = require("../models/Mess");
const router = express.Router();

// Save mess details
router.post("/add", async (req, res) => {
    const { managerEmail, messName, messType, address, upazila, district, totalRooms } = req.body;

    try {
        // Check if a mess already exists for this manager
        const existingMess = await Mess.findOne({ managerEmail });
        if (existingMess) {
            return res.status(400).json({ message: "A mess already exists for this manager" });
        }

        const newMess = new Mess({
            managerEmail,
            messName,
            messType,
            address,
            upazila,
            district,
            totalRooms,
        });

        await newMess.save();
        res.status(201).json({ message: "Mess added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving mess", error });
    }
});

// Get mess details by manager email
router.get("/user/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const mess = await Mess.findOne({ managerEmail: email });
        if (mess) {
            res.status(200).json({ success: true, mess });
        } else {
            res.status(200).json({ success: true, mess: null });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching mess details", error });
    }
});

module.exports = router;
