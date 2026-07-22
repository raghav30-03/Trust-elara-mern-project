import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { getCartItems, getCartTotal, removeFromCart, updateCartItemQuantity, clearCart } from "../utils/cart";

const buildImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;

    const normalized = String(image).replace(/\\/g, "/").replace(/^\/+/, "");
    const path = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
    return `http://localhost:3000/${path}`;
};

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        setCartItems(getCartItems());
    }, []);

    useEffect(() => {
        const refresh = () => setCartItems(getCartItems());
        window.addEventListener("cart-updated", refresh);
        window.addEventListener("storage", refresh);
        return () => {
            window.removeEventListener("cart-updated", refresh);
            window.removeEventListener("storage", refresh);
        };
    }, []);

    const handleRemove = (idOrSlug) => {
        setCartItems(removeFromCart(idOrSlug));
    };

    const handleQuantityChange = (serviceIdOrSlug, quantity) => {
        setCartItems(updateCartItemQuantity(serviceIdOrSlug, quantity));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        navigate("/checkout", { state: { cartItems } });
    };

    const handleClearCart = () => {
        clearCart();
        setCartItems([]);
    };

    const totalAmount = getCartTotal();

    return (
        <>
            <Header />
            <div style={{ backgroundColor: "#F7F1E7", minHeight: "100vh", padding: "60px 0" }}>
                <div className="container">
                    <div className="mb-4">
                        <Link to="/" style={{ color: "#6E491C", textDecoration: "none", fontWeight: 700 }}>
                            ← Continue browsing
                        </Link>
                    </div>

                    <div className="text-center mb-5">
                        <p style={{ color: "#6E491C", fontWeight: 700, letterSpacing: "0.2rem", textTransform: "uppercase" }}>
                            Your cart
                        </p>
                        <h2 className="fw-bold" style={{ color: "#3B2107", fontSize: "36px" }}>
                            Review your selected services
                        </h2>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "#6b6375" }}>
                            Your cart is empty. Add services to proceed to checkout.
                        </div>
                    ) : (
                        <div className="row g-4">
                            <div className="col-lg-8">
                                {cartItems.map((item) => {
                                    const imageUrl = buildImageUrl(item.image);
                                    const unitPrice = Number(item.sellingPrice || item.mrp || 0);
                                    const subtotal = unitPrice * (Number(item.quantity) || 1);

                                    return (
                                        <div className="card mb-4 border-0 shadow-sm rounded-4" key={item._id || item.slug}>
                                            <div className="row g-0 align-items-center">
                                                <div className="col-md-4">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={item.name}
                                                            className="img-fluid rounded-start"
                                                            style={{ height: "100%", objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                height: "100%",
                                                                minHeight: "200px",
                                                                background: "linear-gradient(135deg, #6E491C, #A67C52)",
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h5 className="fw-bold" style={{ color: "#3B2107" }}>
                                                                    {item.name}
                                                                </h5>
                                                                <p style={{ color: "#6b6375" }}>{item.shortDescription || "Service added to cart."}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link text-danger"
                                                                onClick={() => handleRemove(item._id || item.slug)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>

                                                        <div className="d-flex flex-column gap-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <label className="mb-0" style={{ fontWeight: 600, color: "#3B2107" }}>
                                                                    Quantity
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity || 1}
                                                                    className="form-control"
                                                                    style={{ width: "90px" }}
                                                                    onChange={(e) => handleQuantityChange(item._id || item.slug, Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div style={{ color: "#6E491C", fontWeight: 700 }}>
                                                                AED {unitPrice.toFixed(2)} each • Subtotal: AED {subtotal.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#fff" }}>
                                    <h5 className="fw-bold mb-4" style={{ color: "#3B2107" }}>
                                        Order summary
                                    </h5>
                                    <div className="mb-3 d-flex justify-content-between">
                                        <span style={{ color: "#6b6375" }}>Total services</span>
                                        <span style={{ fontWeight: 700, color: "#3B2107" }}>{cartItems.length}</span>
                                    </div>
                                    <div className="mb-4 d-flex justify-content-between">
                                        <span style={{ color: "#6b6375" }}>Total amount</span>
                                        <span style={{ fontWeight: 700, color: "#3B2107" }}>AED {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn w-100 py-3 fw-bold"
                                        style={{
                                            backgroundColor: "#6E491C",
                                            color: "#fff",
                                            borderRadius: "50px",
                                        }}
                                        onClick={handleCheckout}
                                    >
                                        Checkout
                                    </button>
                                    <button
                                        type="button"
                                        className="btn w-100 py-3 fw-bold mt-3"
                                        style={{
                                            backgroundColor: "#F2EEE2",
                                            color: "#3B2107",
                                            borderRadius: "50px",
                                            border: "1px solid #d4cfbf",
                                        }}
                                        onClick={handleClearCart}
                                    >
                                        Clear Cart
                                    </button>
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

export default Cart;
