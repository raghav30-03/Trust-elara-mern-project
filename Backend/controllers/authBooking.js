const Booking = require("../models/booking");

exports.createBooking = async (req, res) => {
    try {
        const {
            serviceId,
            serviceSlug,
            serviceName,
            customerName,
            email,
            phone,
            preferredDate,
            sessions,
            notes,
            totalPrice,
        } = req.body;

        if (!serviceId || !serviceSlug || !serviceName || !customerName || !email || !phone || !totalPrice) {
            return res.status(400).json({ message: "Please provide all required booking fields." });
        }

        const booking = new Booking({
            serviceId,
            serviceSlug,
            serviceName,
            customerName,
            email,
            phone,
            preferredDate,
            sessions,
            notes,
            totalPrice,
        });

        await booking.save();

        return res.status(201).json({ success: true, message: "Booking created successfully.", booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
