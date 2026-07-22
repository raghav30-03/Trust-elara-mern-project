import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const decodeUserFromToken = (token) => {
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(base64));
        return {
            name: decoded.name || decoded.email || "User",
            email: decoded.email || "",
        };
    } catch (error) {
        return null;
    }
};

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/user/login", formData);

            if (response.data?.success) {
                const token = response.data?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    const user = decodeUserFromToken(token) || {
                        name: formData.email.split("@")[0],
                        email: formData.email,
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                    window.dispatchEvent(new Event("auth-state-changed"));
                }
                navigate("/");
            } else {
                setError(response.data?.message || "Login failed.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials.",
            );
        }
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: "#F2EEE2",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="container">
                    <div
                        className="row align-items-center justify-content-center g-0"
                        style={{ minHeight: "90vh" }}
                    >
                        <div className="col-md-5 d-none d-md-block pe-4">
                            <div
                                style={{
                                    borderRadius: "24px",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src="/Images/login-hero.png"
                                    alt="Doctor"
                                    style={{
                                        width: "100%",
                                        height: "580px",
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
                                    <i className="bi bi-arrow-left"></i> Back to
                                    Home
                                </Link>
                            </div>

                            <div className="text-center mb-4">
                                <Link to="/" style={{ textDecoration: "none" }}>
                                    <img
                                        src="/Images/health-serve-logo.png"
                                        alt="Elara Logo"
                                        height="65px"
                                    />
                                </Link>
                            </div>

                            <h3
                                className="fw-bold text-center mb-4"
                                style={{ color: "#3B2107", fontSize: "32px" }}
                            >
                                Log In
                            </h3>

                            {error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control py-3 px-4"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            borderRadius: "50px",
                                            backgroundColor: "#EDE8DF",
                                            border: "none",
                                            fontSize: "15px",
                                            color: "#3B2107",
                                        }}
                                    />
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
                                            borderRadius: "50px",
                                            backgroundColor: "#EDE8DF",
                                            border: "none",
                                            fontSize: "15px",
                                            color: "#3B2107",
                                            paddingRight: "50px",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
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
                                                showPassword
                                                    ? "bi-eye-slash"
                                                    : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <a
                                        href="#"
                                        style={{
                                            color: "#3B2107",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-100 py-3 fw-bold"
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
                                        (e.target.style.backgroundColor =
                                            "#5a3a14")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.backgroundColor =
                                            "#6E491C")
                                    }
                                >
                                    Login
                                </button>
                            </form>

                            <p
                                className="text-center mt-4 mb-0"
                                style={{ fontSize: "15px", color: "#6b6375" }}
                            >
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    style={{
                                        color: "#3B2107",
                                        fontWeight: "700",
                                        textDecoration: "none",
                                    }}
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
