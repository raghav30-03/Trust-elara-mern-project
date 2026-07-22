const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
            },
            "secretKey",
            {
                expiresIn: "1h",
            },
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phoneNo, phone } = req.body;
        const normalizedPhone = phoneNo ?? phone;

        if (!name || !email || !password || !normalizedPhone) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, password, and phone number.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo: normalizedPhone,
        });
        await user.save();

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};