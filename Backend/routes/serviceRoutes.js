const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const {
    newService,
    getServices,
    getServiceBySlug,
    deleteService,
    editService,
} = require("../controllers/authServices");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/add",  upload.single("image"), newService);

router.get("/", getServices);

router.get("/:slug", getServiceBySlug);

router.put("/edit/:slug",  upload.single("image"), editService);

router.delete("/delete/:slug", deleteService);

module.exports = router;