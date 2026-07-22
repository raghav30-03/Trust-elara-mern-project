const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    phoneNo: {
        type: Number,
        required: true,
        length: 10,
    },

    lastLoginAt: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

module.exports = mongoose.model("Users", userSchema, "users");