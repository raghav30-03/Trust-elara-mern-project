const express = require("express");

const router = express.Router();

const { login , register, getUsers } = require("../controllers/authUsers");

router.get("/", getUsers);
router.post("/login", login);
router.post("/register", register);

module.exports = router;