import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/header";
import Footer from "../components/footer";

const buildImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;

    const normalized = String(image).replace(/\\/g, "/").replace(/^\/+/, "");
    const path = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
    return `http://localhost:3000/${path}`;
};

function Services() {
    const { categorySlug } = useParams();
    const [services, setServices] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const [servicesResponse, categoryResponse] = await Promise.all([
                    api.get("/services"),
                    api.get(`/categories/${categorySlug}`),
                ]);

                const allServices = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
                const matchingServices = allServices.filter(
                    (service) => String(service.category).toLowerCase() === String(categorySlug).toLowerCase(),
                );

                setServices(matchingServices.filter((service) => service.status !== false));
                setCategoryName(categoryResponse.data?.name || categorySlug);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load services for this category.");
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug) {
            fetchServices();
        } else {
            setLoading(false);
        }
    }, [categorySlug]);

    return (
        <>
            <Header />
            <div style={{ backgroundColor: "#F7F1E7", minHeight: "100vh", padding: "60px 0" }}>
                <div className="container">
                    <div className="mb-4">
                        <Link to="/categories" style={{ color: "#6E491C", textDecoration: "none", fontWeight: 700 }}>
                            ← Back to categories
                        </Link>
                    </div>

                    <div className="text-center mb-5">
                        <p style={{ color: "#6E491C", fontWeight: 700, letterSpacing: "0.2rem", textTransform: "uppercase" }}>
                            Category services
                        </p>
                        <h2 className="fw-bold" style={{ color: "#3B2107", fontSize: "36px" }}>
                            {categoryName ? `${categoryName} Services` : "Services"}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading services...</div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">{error}</div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-5" style={{ color: "#6b6375" }}>
                            No services are available for this category yet.
                        </div>
                    ) : (
                        <div className="row g-4">
                            {services.map((service) => {
                                const imageUrl = buildImageUrl(service.image);

                                return (
                                    <div className="col-md-4" key={service._id || service.slug}>
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={service.name}
                                                    style={{ height: "220px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        height: "220px",
                                                        background: "linear-gradient(135deg, #6E491C, #A67C52)",
                                                    }}
                                                />
                                            )}
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold" style={{ color: "#3B2107" }}>
                                                    {service.name}
                                                </h5>
                                                <p style={{ color: "#6b6375", minHeight: "48px" }}>
                                                    {service.shortDescription || "Explore this service for personalized care."}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold" style={{ color: "#6E491C" }}>
                                                        AED {service.sellingPrice || service.mrp || 0}
                                                    </span>
                                                    <Link
                                                        to={`/service/${service.slug || service._id}`}
                                                        className="btn"
                                                        style={{
                                                            backgroundColor: "#6E491C",
                                                            color: "#fff",
                                                            borderRadius: "50px",
                                                            textDecoration: "none",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        Book Now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Services;