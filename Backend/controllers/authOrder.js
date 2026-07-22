const Order = require("../models/order");

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createOrder = async (req, res) => {
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
            return res.status(400).json({ message: "Please provide all required order fields." });
        }

        const order = new Order({
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

        await order.save();

        return res.status(201).json({ success: true, message: "Order created successfully.", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
