const Service = require("../models/services");
const mongoose = require("mongoose");

// 1. ADD NEW Service
exports.newService = async (req, res) => {
    try {
        const { name, slug, category, fasting, ageGroup, gender, vitalSystem, preventiveWellness, shortDescription, longDescription, mrp, sellingPrice, status, image } = req.body;
        const slugClean = String(slug || '').trim();

        if (!slugClean) {
            return res.status(400).json({ message: "Please provide a valid slug" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const existingServices = await Service.findOne({ slug: slugClean });
        if (existingServices) {
            return res.status(400).json({
                message: "Service Already Exists",
            });
        }

        const imagePath = req.file.path;

        const services = new Service({
            name,
            slug: slugClean,
            category,
            fasting,
            ageGroup,
            gender,
            vitalSystem,
            preventiveWellness,
            shortDescription,
            longDescription,
            mrp,
            sellingPrice,
            status,
            image: imagePath,
        });

        await services.save();

        res.status(201).json({
            message: "Added Service Successfully",
            services,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// 2. GET ALL services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getServiceBySlug = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();
        let filter;
        if (mongoose.Types.ObjectId.isValid(param)) {
            filter = { _id: param };
        } else {
            filter = { $or: [{ slug: rawParam }, { slug: param }] };
        }

        const serviceData = await Service.findOne(filter);

        if (!serviceData) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(serviceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editService = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();
        const { name, slug, category, fasting, ageGroup, gender, vitalSystem, preventiveWellness, shortDescription, longDescription, mrp, sellingPrice, status } = req.body;
        const slugClean = String(slug || '').trim();

        let updateData = { name, category, fasting, ageGroup, gender, vitalSystem, preventiveWellness, shortDescription, longDescription, mrp, sellingPrice, status };
        if (slugClean) {
            updateData.slug = slugClean;
        }
        if (req.file) {
            updateData.image = req.file.path;
        }

        let filter;
        if (mongoose.Types.ObjectId.isValid(param)) {
            filter = { _id: param };
        } else {
            filter = { $or: [{ slug: rawParam }, { slug: param }] };
        }

        const updatedService = await Service.findOneAndUpdate(
            filter,
            updateData,
            { new: true },
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found to update" });
        }

        res.status(200).json({
            message: "Updated Service Successfully",
            Service: updatedService,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();

        let filter;
        if (mongoose.Types.ObjectId.isValid(param)) {
            filter = { _id: param };
        } else {
            filter = { $or: [{ slug: rawParam }, { slug: param }] };
        }

        const deletedService = await Service.findOneAndDelete(filter);

        if (!deletedService) {
            return res.status(404).json({ message: "Service not found to delete" });
        }

        res.status(200).json({
            message: "Deleted Service Successfully",
            Service: deletedService
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};