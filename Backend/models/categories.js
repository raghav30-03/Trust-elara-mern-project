const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },
        shortDescription: {
            type: String,
            required: true,
        },

        longDescription: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Categories", categorySchema, "categories");
