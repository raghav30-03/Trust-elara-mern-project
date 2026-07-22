const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    newCategory,
    getCategories,
    getCategoryBySlug,
    deleteCategory,
    editCategory,
} = require("../controllers/authCategories");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), newCategory);

router.get("/", getCategories);

router.get("/:slug", getCategoryBySlug);

router.put("/edit/:slug", upload.single("image"), editCategory);

router.delete("/delete/:slug", deleteCategory);

module.exports = router;