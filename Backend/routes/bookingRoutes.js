const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/authBooking");

router.post("/", createBooking);

module.exports = router;
