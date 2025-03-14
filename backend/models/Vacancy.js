const mongoose = require("mongoose");

const VacancySchema = new mongoose.Schema({
    messName: {
        type: String,
        required: true,
    },
    messDescription: {
        type: String,
        required: true,
    },
    messType: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    upazila: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    totalOccupants: {
        type: Number,
        required: true,
    },
    messManagerEmail: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String], // array of image urls
        default: [],
    },
});

const Vacancy = mongoose.model("Vacancies", VacancySchema);

module.exports = Vacancy;
