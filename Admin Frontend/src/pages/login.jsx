import React, { useState } from "react";
import axios from "axios";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./login.css";

function Login() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const InputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const Submit = async (e) => {
        e.preventDefault();

        if (!userData.email || !userData.password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            console.log("Verifying Details...");

            const response = await API.post("/admin/login", userData);

            localStorage.setItem("token", response.data.token);
            alert("Login Successful");
            navigate("/categories");
        } catch (error) {
            console.error("Login Error:", error);

            const errorMessage =
                error.response?.data?.message ||
                "Something went wrong. Try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className="container-fluid main-container p-0">
            <div className="top-section"></div>
            <div className="login-wrapper">
                <div className="logo-container">
                    <img
                        src="/Images/health-serve-logo.png"
                        alt="Elara Logo"
                        style={{ width: "150px" }}
                    />
                </div>
                <form onSubmit={Submit}>
                    <div className="card login-card border-0">
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control custom-input"
                                    placeholder="Enter Your Email"
                                    value={userData.email}
                                    onChange={InputChange}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control custom-input"
                                    placeholder="Enter Password"
                                    value={userData.password}
                                    onChange={InputChange}
                                    required
                                />
                            </div>
                            <div className="text-end mb-4 ">
                                <a href="/" className="forgot-link ">
                                    Forgot Password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-success w-100 login-btn"
                            >
                                Authenticate
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
