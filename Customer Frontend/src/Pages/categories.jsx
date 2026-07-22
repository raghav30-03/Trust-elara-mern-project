import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                const items = Array.isArray(response.data) ? response.data : [];
                setCategories(items.filter((category) => category.status !== false));
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <Header />
            <div style={{ backgroundColor: "#F7F1E7", minHeight: "100vh", padding: "60px 0" }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <p style={{ color: "#6E491C", fontWeight: 700, letterSpacing: "0.2rem", textTransform: "uppercase" }}>
                            Explore care services
                        </p>
                        <h2 className="fw-bold" style={{ color: "#3B2107", fontSize: "36px" }}>
                            Categories
                        </h2>
                        <p style={{ color: "#6b6375", maxWidth: "700px", margin: "0 auto" }}>
                            Browse all available categories and choose the care option that fits your needs.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">Loading categories...</div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : (
                        <div className="row g-4">
                            {categories.map((category) => {
                                const imageUrl = buildImageUrl(category.image);

                                return (
                                    <div className="col-md-4" key={category._id || category.slug}>
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={category.name}
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
                                                    {category.name}
                                                </h5>
                                                <p style={{ color: "#6b6375", minHeight: "48px" }}>
                                                    {category.shortDescription || "Discover the services available in this category."}
                                                </p>
                                                <Link
                                                    to={`/services/${category.slug || category._id}`}
                                                    className="btn fw-bold"
                                                    style={{
                                                        backgroundColor: "#6E491C",
                                                        color: "#fff",
                                                        borderRadius: "50px",
                                                    }}
                                                >
                                                    View Services
                                                </Link>
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

export default CategoriesPage;
