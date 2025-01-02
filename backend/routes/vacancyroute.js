const express = require("express");
const Vacancy = require("../models/Vacancy");
const router = express.Router();

// Save vacancy details
router.post("/add", async (req, res) => {
    const { messName, messType, address, upazila, district, totalOccupants, messManagerEmail, price } = req.body;

    const newVacancy = new Vacancy({
        messName,
        messType,
        address,
        upazila,
        district,
        totalOccupants,
        messManagerEmail,
        price,
    });

    try {
        await newVacancy.save();
        res.status(201).json({ message: "Vacancy added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving vacancy", error });
    }
});

// Get vacancy details
router.get("/get/:district/:upazila", async (req, res) => {
    const { district, upazila } = req.params;

    try {
        const vacancies = await Vacancy.find({ district, upazila });
        res.status(200).json(vacancies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching vacancies", error });
    }
});

// Find vacancy by manager email
router.get("/mess/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const vacancie = await Vacancy.find({ messManagerEmail: email });
        if (vacancie) {
            res.status(200).json({ success: true, vacancie });
        } else {
            res.status(200).json({ success: true, vacancie: [] });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching vacancy", error });
    }
});

module.exports = router;