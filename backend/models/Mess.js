const mongoose = require("mongoose");

const messOccupantSchema = new mongoose.Schema({
    managerEmail : {
        type : String,
        required : true,
    },
    messName : {
        type : String,
        required : true,
    },
    messType : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true,
    },
    upazila : {
        type : String,
        required : true,
    },
    district : {
        type : String,
        required : true,
    },
    totalRooms : {
        type : Number,
        required : true,
    },
});

const Mess = mongoose.model("Mess", messOccupantSchema);

module.exports = Mess;