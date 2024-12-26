const mongoose = require("mongoose");

const messOccupantSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    phone : {
        type : String,
    },
    messManagerEmail : {
        type : String,
        required : true,
    },
    messName : {
        type : String,
        required : true,
    },
    messTytpe : {
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
    roomNo : {
        type : Number,
        required : true,
    },
    totalOccupants : {
        type : Number,
        required : true,
    },
});

const Account = mongoose.model("MessOccupants", messOccupantSchema);

module.exports = Account;