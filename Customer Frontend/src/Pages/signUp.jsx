import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const res = await api.post("/user/register", {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phoneNo: formData.phone,
                password: formData.password,
            });

            if (res.data?.success) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(res.data?.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        borderRadius: "50px",
        backgroundColor: "#EDE8DF",
        border: "none",
        fontSize: "15px",
        color: "#3B2107",
    };

    return (
        <div
            style={{
                backgroundColor: "#F2EEE2",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                padding: "40px 0",
            }}
        >
            <div className="container">
                <div className="row align-items-center justify-content-center g-0">
                    <div className="col-md-5 d-none d-md-block pe-4">
                        <div
                            style={{
                                borderRadius: "24px",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <img
                                src="/Images/register-hero.png"
                                alt="Doctors"
                                style={{
                                    width: "100%",
                                    height: "430px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor:
                                        "rgba(74, 113, 60, 0.45)",
                                    borderRadius: "24px",
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="col-md-5 ps-md-4">
                        <div className="mb-3">
                            <Link
                                to="/"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "#6E491C",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}
                            >
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </Link>
                        </div>

                        <h3
                            className="fw-bold text-center mb-4"
                            style={{ color: "#3B2107", fontSize: "32px" }}
                        >
                            Register
                        </h3>

                        {error ? (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        ) : null}

                        {success ? (
                            <div className="alert alert-success" role="alert">
                                {success}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-control py-3 px-4"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-control py-3 px-4"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control py-3 px-4"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div className="mb-3">
                                <div
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        backgroundColor: "#EDE8DF",
                                        borderRadius: "50px",
                                        padding: "4px 16px 4px 8px",
                                        border: "none",
                                    }}
                                >
                                    <div
                                        className="d-flex align-items-center gap-1 pe-2"
                                        style={{
                                            borderRight: "1.5px solid #c5b89a",
                                            paddingRight: "10px",
                                        }}
                                    >
                                        <span style={{ fontSize: "18px" }}>🇦🇪</span>
                                        <i
                                            className="bi bi-chevron-down"
                                            style={{
                                                fontSize: "12px",
                                                color: "#6E491C",
                                            }}
                                        ></i>
                                    </div>

                                    <input
                                        type="tel"
                                        name="phone"
                                        className="py-2 px-2"
                                        placeholder="Phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            outline: "none",
                                            fontSize: "15px",
                                            color: "#3B2107",
                                            width: "100%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-control py-3 px-4"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...inputStyle,
                                        paddingRight: "50px",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "18px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        color: "#8B7355",
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                >
                                    <i
                                        className={`bi ${
                                            showPassword ? "bi-eye-slash" : "bi-eye"
                                        }`}
                                    ></i>
                                </button>
                            </div>

                            <div className="mb-3 position-relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="form-control py-3 px-4"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...inputStyle,
                                        paddingRight: "50px",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        right: "18px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        color: "#8B7355",
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                >
                                    <i
                                        className={`bi ${
                                            showConfirmPassword
                                                ? "bi-eye-slash"
                                                : "bi-eye"
                                        }`}
                                    ></i>
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-100 py-3 fw-bold"
                                disabled={submitting}
                                style={{
                                    backgroundColor: "#6E491C",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    letterSpacing: "0.5px",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.backgroundColor = "#5a3a14")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.backgroundColor = "#6E491C")
                                }
                            >
                                {submitting ? "Registering..." : "Register"}
                            </button>
                        </form>

                        <p
                            className="text-center mt-4 mb-0"
                            style={{ fontSize: "15px", color: "#6b6375" }}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                style={{
                                    color: "#3B2107",
                                    fontWeight: "700",
                                    textDecoration: "none",
                                }}
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
