const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        
        fasting: {
            type: Boolean,
            required: true,
        },
        ageGroup: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        vitalSystem: {
            type: String,
            required: true,
        },
        preventiveWellness: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true
        },
        longDescription: {
            type: String,
            required: true
        },
        mrp: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        image: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema, "service");
