import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { addToCart } from "../utils/cart";

const buildImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;

    const normalized = String(image).replace(/\\/g, "/").replace(/^\/+/, "");
    const path = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
    return `http://localhost:3000/${path}`;
};

function ServiceDetail() {
    const { serviceSlug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/services/${serviceSlug}`);
                setService(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load service details.");
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceSlug]);

    const [message, setMessage] = useState("");
    const imageUrl = buildImageUrl(service?.image);
    const price = useMemo(() => {
        return service?.sellingPrice || service?.mrp || 0;
    }, [service]);

    const handleAddToCart = () => {
        if (!service) return;
        addToCart({
            _id: service._id,
            slug: service.slug,
            name: service.name,
            image: service.image,
            shortDescription: service.shortDescription,
            sellingPrice: service.sellingPrice,
            mrp: service.mrp,
            quantity: 1,
        });
        setMessage("Service added to cart.");
    };

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
                            ← Back to categories
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading service details...</div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : (
                        service && (
                            <div className="row gy-5">
                                <div className="col-lg-7">
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={service.name}
                                                className="w-100"
                                                style={{ height: "520px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    height: "520px",
                                                    background: "linear-gradient(135deg, #6E491C, #A67C52)",
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-5">
                                    <div className="mb-4">
                                        <h1 className="fw-bold" style={{ color: "#3B2107", fontSize: "2.5rem" }}>
                                            {service.name}
                                        </h1>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div style={{ color: "#F7B500" }}>
                                                ★★★★★
                                            </div>
                                            <span style={{ color: "#6b6375" }}>(0 Reviews)</span>
                                        </div>
                                        <p style={{ color: "#6b6375", lineHeight: 1.8 }}>
                                            {service.longDescription || service.shortDescription || "Our experts deliver this service with care and safety."}
                                        </p>

                                        <ul style={{ color: "#3B2107", lineHeight: 1.9, paddingLeft: "1.1rem" }}>
                                            <li>Stress relief and renewed energy.</li>
                                            <li>Improves circulation and mood.</li>
                                            <li>Supports overall wellbeing and recovery.</li>
                                        </ul>
                                    </div>

                                    <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: "#fff" }}>
                                        <div className="mb-4">
                                            <h3 className="fw-bold" style={{ color: "#3B2107" }}>
                                                Add this service to your cart
                                            </h3>
                                            <p style={{ color: "#6b6375" }}>
                                                Add to cart now and review your services before checkout.
                                            </p>
                                        </div>

                                        <div className="d-grid gap-3">
                                            <button
                                                type="button"
                                                className="btn py-3 fw-bold"
                                                style={{
                                                    backgroundColor: "#6E491C",
                                                    color: "#fff",
                                                    borderRadius: "50px",
                                                }}
                                                onClick={handleAddToCart}
                                            >
                                                Add to Cart
                                            </button>
                                            <Link
                                                to="/cart"
                                                className="btn py-3 fw-bold"
                                                style={{
                                                    backgroundColor: "#F2EEE2",
                                                    color: "#3B2107",
                                                    borderRadius: "50px",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                View Cart
                                            </Link>
                                        </div>

                                        {message && (
                                            <div className="alert alert-success mt-4" role="alert">
                                                {message}
                                            </div>
                                        )}

                                        <div className="mt-4 p-3 rounded-3" style={{ background: "#F2EEE2" }}>
                                            <div style={{ color: "#6E491C", fontWeight: 700 }}>Starting at</div>
                                            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#3B2107" }}>
                                                AED {price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ServiceDetail;
