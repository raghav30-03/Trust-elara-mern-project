const Categories = require("../models/categories");
const mongoose = require("mongoose");

// 1. ADD NEW CATEGORY
exports.newCategory = async (req, res) => {
    try {
        const { name, slug, shortDescription, longDescription, status } = req.body;
        const slugClean = String(slug || '').trim();

        if (!slugClean) {
            return res.status(400).json({ message: "Please provide a valid slug" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const existingCategories = await Categories.findOne({ slug: slugClean });
        if (existingCategories) {
            return res.status(400).json({
                message: "Category Already Exists",
            });
        }

        const imagePath = req.file.path;

        const categories = new Categories({
            name,
            slug: slugClean,
            shortDescription,
            longDescription,
            image: imagePath,
            status,
        });

        await categories.save();

        res.status(201).json({
            message: "Added Category Successfully",
            categories,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// 2. GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
    try {
        const categories = await Categories.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();
        let filter;
        if (mongoose.Types.ObjectId.isValid(param)) {
            filter = { _id: param };
        } else {
            filter = { $or: [{ slug: rawParam }, { slug: param }] };
        }

        const category = await Categories.findOne(filter);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.editCategory = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();
        const { name, slug, shortDescription, longDescription, status } = req.body;
        const slugClean = String(slug || '').trim();

        let updateData = { name, shortDescription, longDescription, status };
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

        const updatedCategory = await Categories.findOneAndUpdate(
            filter,
            updateData,
            { new: true },
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found to update" });
        }

        res.status(200).json({
            message: "Updated Category Successfully",
            category: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const rawParam = String(req.params.slug || '');
        const param = rawParam.trim();

        let filter;
        if (mongoose.Types.ObjectId.isValid(param)) {
            filter = { _id: param };
        } else {
            filter = { $or: [{ slug: rawParam }, { slug: param }] };
        }

        const deletedCategory = await Categories.findOneAndDelete(filter);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found to delete" });
        }

        res.status(200).json({
            message: "Deleted Category Successfully",
            category: deletedCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};