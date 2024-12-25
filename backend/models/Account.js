const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: { 
        type: String, 
        required: true 
    },
    userType: {
        type: String,
        enum: ["user", "messManager"],
        default: "user",
    },
    phone: {
        type: String,
        required: function () {
            return this.userType === "messManager";
        },
    },
});

const Account = mongoose.model("Accounts", accountSchema);

module.exports = Account;
