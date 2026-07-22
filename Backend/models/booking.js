const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        serviceSlug: {
            type: String,
            required: true,
        },
        serviceName: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        preferredDate: {
            type: String,
        },
        sessions: {
            type: Number,
            default: 1,
        },
        notes: {
            type: String,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
