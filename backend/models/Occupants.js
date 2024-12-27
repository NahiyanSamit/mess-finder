const mongoose = require("mongoose");

const OccupantSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    age : {
        type : Number,
        required : true,
    },
    phone : {
        type : String,
    },
    managerEmail : {
        type : String,
        required : true,
    },
    roomNo : {
        type : Number,
        required : true,
    },
});

const Occupant = mongoose.model("Occupants", OccupantSchema);

module.exports = Occupant;