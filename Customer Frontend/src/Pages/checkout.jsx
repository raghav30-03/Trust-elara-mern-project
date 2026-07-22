import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { clearCart, getCartItems, getCartTotal } from "../utils/cart";

const buildImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;

    const normalized = String(image).replace(/\\/g, "/").replace(/^\/+/, "");
    const path = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
    return `http://localhost:3000/${path}`;
};

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        notes: "",
    });

    useEffect(() => {
        const items = Array.isArray(location.state?.cartItems) && location.state.cartItems.length > 0
            ? location.state.cartItems
            : getCartItems();

        setCartItems(items);
        setLoading(false);
    }, [location.state]);

    const totalAmount = useMemo(() => {
        return getCartTotal();
    }, [cartItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add services before checking out.");
            return;
        }

        if (!formData.name || !formData.email || !formData.phone) {
            setError("Please fill in your name, email, and phone number.");
            return;
        }

        setSubmitting(true);
        try {
            const orderRequests = cartItems.map((item) => {
                const quantity = Number(item.quantity || 1);
                const price = Number(item.sellingPrice || item.mrp || 0);
                return api.post("/orders", {
                    serviceId: item._id,
                    serviceSlug: item.slug,
                    serviceName: item.name,
                    customerName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    preferredDate: formData.preferredDate,
                    sessions: quantity,
                    notes: formData.notes,
                    totalPrice: price * quantity,
                });
            });

            await Promise.all(orderRequests);
            clearCart();
            setCartItems([]);
            setFormData({
                name: "",
                email: "",
                phone: "",
                preferredDate: "",
                notes: "",
            });
            window.alert("Order placed successfully!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to submit your order.");
        } finally {
            setSubmitting(false);
        }
    };

    const hasCartItems = cartItems.length > 0;

    return (
        <>
            <Header />
            <div style={{ backgroundColor: "#F7F1E7", minHeight: "100vh", padding: "60px 0" }}>
                <div className="container">
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                color: "#6E491C",
                                textDecoration: "none",
                                fontWeight: 700,
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                            }}
                        >
                            ← Back to cart
                        </button>
                    </div>

                    <div className="text-center mb-5">
                        <p style={{ color: "#6E491C", fontWeight: 700, letterSpacing: "0.2rem", textTransform: "uppercase" }}>
                            Checkout
                        </p>
                        <h2 className="fw-bold" style={{ color: "#3B2107", fontSize: "36px" }}>
                            Complete your booking
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading checkout details...</div>
                    ) : !hasCartItems ? (
                        <div className="text-center py-5" style={{ color: "#6b6375" }}>
                            <p>Your cart is empty. Add services to your cart before checkout.</p>
                            <Link to="/cart" style={{ color: "#6E491C", textDecoration: "underline" }}>
                                Go to cart
                            </Link>
                        </div>
                    ) : (
                        <div className="row gy-5">
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: "#fff" }}>
                                    <h3 className="fw-bold" style={{ color: "#3B2107" }}>
                                        Order details
                                    </h3>
                                    <p style={{ color: "#6b6375" }}>Review your selected services and complete the form below.</p>

                                    {cartItems.map((item) => {
                                        const imageUrl = buildImageUrl(item.image);
                                        const quantity = Number(item.quantity || 1);
                                        const price = Number(item.sellingPrice || item.mrp || 0);
                                        return (
                                            <div key={item._id || item.slug} className="d-flex gap-3 mb-4">
                                                <div style={{ width: "110px", minHeight: "90px", overflow: "hidden", borderRadius: "18px" }}>
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={item.name}
                                                            className="img-fluid"
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #6E491C, #A67C52)" }} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold" style={{ color: "#3B2107" }}>{item.name}</h5>
                                                    <p className="mb-1" style={{ color: "#6b6375" }}>{item.shortDescription || "Service in your cart."}</p>
                                                    <p className="mb-0" style={{ color: "#6E491C", fontWeight: 700 }}>
                                                        {quantity} × AED {price.toFixed(2)} = AED {(price * quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#fff" }}>
                                    <h3 className="fw-bold" style={{ color: "#3B2107" }}>
                                        Customer information
                                    </h3>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Preferred date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="preferredDate"
                                                value={formData.preferredDate}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Notes</label>
                                            <textarea
                                                className="form-control"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="3"
                                            />
                                        </div>

                                        {success && <div className="alert alert-success">{success}</div>}
                                        {error && <div className="alert alert-danger">{error}</div>}

                                        <button
                                            type="submit"
                                            className="btn w-100 py-3 fw-bold"
                                            style={{
                                                backgroundColor: "#6E491C",
                                                color: "#fff",
                                                borderRadius: "50px",
                                            }}
                                            disabled={submitting}
                                        >
                                            {submitting ? "Submitting..." : "Place order"}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#fff" }}>
                                    <h5 className="fw-bold" style={{ color: "#3B2107" }}>Order summary</h5>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span style={{ color: "#6b6375" }}>Items</span>
                                        <span style={{ fontWeight: 700, color: "#3B2107" }}>{cartItems.length}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span style={{ color: "#6b6375" }}>Total amount</span>
                                        <span style={{ fontWeight: 700, color: "#3B2107" }}>AED {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div style={{ color: "#6b6375", lineHeight: 1.7 }}>
                                        We will save your order details in the database after checkout.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Checkout;
