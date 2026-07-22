const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                message: "admin Not Found",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                name: admin.name,
            },
            "secretKey",
            {
                expiresIn: "1h",
            },
        );

        res.status(200).json({
            message: "Login Successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
