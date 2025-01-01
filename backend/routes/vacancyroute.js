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

module.exports = router;