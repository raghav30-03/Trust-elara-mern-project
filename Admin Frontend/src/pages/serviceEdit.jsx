import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import CategoriesTopNavBar from "../components/categoriesTopNavBar";
import "../components/ElaraAdminSideBar.css";

function EditService() {
    const navigate = useNavigate();
    const { slug } = useParams();

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await API.get("/categories/");
            setCategories(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        fasting: false,
        ageGroup: "",
        gender: "",
        vitalSystem: "",
        preventiveWellness: "",
        slug: "",
        shortDescription: "",
        longDescription: "",
        mrp: "",
        sellingPrice: "",
        image: null,
        status: true,
    });

    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await API.get(
                    `/services/${encodeURIComponent(slug)}`,
                    {
                        headers: { Authorization: token },
                    },
                );

                const service = response.data?.service || response.data;

                setFormData({
                    name: service?.name || "",
                    category: service?.category || "",
                    fasting:
                        service?.fasting === false ||
                        service?.fasting === "false" ||
                        service?.fasting === 0,
                    ageGroup: service?.ageGroup || "",
                    gender: service?.gender || "",
                    vitalSystem: service?.vitalSystem || "",
                    preventiveWellness: service?.preventiveWellness || "",
                    slug: service?.slug || slug,
                    shortDescription: service?.shortDescription || "",
                    longDescription: service?.longDescription || "",
                    mrp: service?.mrp || "",
                    sellingPrice: service?.sellingPrice || "",
                    image: null,
                    status:
                        service?.status === true ||
                        service?.status === "true" ||
                        service?.status === 1,
                });

                if (service.image) {
                    const cleanPath = service.image.replaceAll("\\", "/");
                    setImagePreview(`http://localhost:3000/${cleanPath}`);
                }
            } catch (error) {
                console.error("Error fetching Service details:", error);
                alert(
                    error.response?.data?.message ||
                        "Failed to load Service details.",
                );
                navigate("/services");
            }
        };

        fetchServiceDetails();
    }, [slug, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSwitchChange = (e) => {
        setFormData({ ...formData, status: e.target.checked });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("fasting", formData.fasting);
            formDataToSend.append("ageGroup", formData.ageGroup);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("vitalSystem", formData.vitalSystem);
            formDataToSend.append(
                "preventiveWellness",
                formData.preventiveWellness,
            );
            formDataToSend.append("slug", String(formData.slug || "").trim());
            formDataToSend.append(
                "shortDescription",
                formData.shortDescription,
            );
            formDataToSend.append("longDescription", formData.longDescription);
            formDataToSend.append("mrp", formData.mrp);
            formDataToSend.append("sellingPrice", formData.sellingPrice);
            formDataToSend.append("status", formData.status);

            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            await API.put(
                `/services/edit/${encodeURIComponent(slug)}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );

            alert("Service Updated Successfully!");
            navigate("/services");
        } catch (error) {
            console.error("Service update error:", error);
            alert(
                error.response?.data?.message ||
                    "Something went wrong updating. Try again.",
            );
        }
    };

    const handleCancel = () => {
        navigate("/services");
    };

    return (
        <div className="container-fluid adminMainPage">
            <div className="row">
                <Sidebar />

                <div className="col-9 serviceContainer">
                    {/* Top Navbar Section */}
                    <CategoriesTopNavBar />

                    {/* Edit Form Body Layout */}
                    <div className="container py-4">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="bg-white rounded-3 border p-4 p-md-5 text-black">
                                    <h4 className="fw-semibold mb-3">
                                        Service Edit
                                    </h4>
                                    <hr className="mb-4" />

                                    <form onSubmit={handleSubmit}>
                                        {/* Service Name */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Service Name
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Slug */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="slug"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Slug
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="slug"
                                                    name="slug"
                                                    value={formData.slug}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="category"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Category
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-select"
                                                    id="category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Category
                                                    </option>
                                                    {categories.map(
                                                        (category, index) => {
                                                            return (
                                                                <option
                                                                    key={
                                                                        category._id ||
                                                                        index
                                                                    }
                                                                    value={
                                                                        category.slug
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Fasting */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold m-0">
                                                    Fasting Required
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="fasting"
                                                        name="fasting"
                                                        checked={
                                                            formData.fasting
                                                        }
                                                        onChange={
                                                            handleCheckboxChange
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="fasting"
                                                    >
                                                        Yes, fasting is required
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Age Group */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="ageGroup"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Age Group
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-select"
                                                    id="ageGroup"
                                                    name="ageGroup"
                                                    value={formData.ageGroup}
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Age Group
                                                    </option>
                                                    <option value="0-18">
                                                        0-18 years
                                                    </option>
                                                    <option value="18-40">
                                                        18-40 years
                                                    </option>
                                                    <option value="41-65">
                                                        41-65 years
                                                    </option>
                                                    <option value="65+">
                                                        65+ years
                                                    </option>
                                                    <option value="all">
                                                        All ages
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="gender"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Gender
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-select"
                                                    id="gender"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Gender
                                                    </option>
                                                    <option value="male">
                                                        Male
                                                    </option>
                                                    <option value="female">
                                                        Female
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Vital System */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="vitalSystem"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Vital System
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-select"
                                                    id="vitalSystem"
                                                    name="vitalSystem"
                                                    value={formData.vitalSystem}
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Vital System
                                                    </option>
                                                    <option value="heartHealth">
                                                        Heart Health
                                                    </option>
                                                    <option value="hormonal">
                                                        Hormonal
                                                    </option>
                                                    <option value="digestive">
                                                        Digestive
                                                    </option>
                                                    <option value="guts">
                                                        Guts
                                                    </option>
                                                    <option value="lungs">
                                                        Lungs
                                                    </option>
                                                    <option value="kidney">
                                                        Kidney
                                                    </option>
                                                    <option value="reproductiveHealth">
                                                        Reproductive Health
                                                    </option>
                                                    <option value="mentalHealth">
                                                        Mental Health
                                                    </option>
                                                    <option value="hair">
                                                        Hair
                                                    </option>
                                                    <option value="bone">
                                                        Bone
                                                    </option>
                                                    <option value="liver">
                                                        Liver
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Preventive Wellness */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="preventiveWellness"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Preventive Wellness
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <select
                                                    className="form-select"
                                                    id="preventiveWellness"
                                                    name="preventiveWellness"
                                                    value={
                                                        formData.preventiveWellness
                                                    }
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Option
                                                    </option>
                                                    <option value="yes">
                                                        Yes
                                                    </option>
                                                    <option value="no">
                                                        No
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Short Description */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="shortDescription"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Short Description
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="shortDescription"
                                                    name="shortDescription"
                                                    value={
                                                        formData.shortDescription
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Enter brief overview"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Long Description */}
                                        <div className="row mb-3 align-items-start">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="longDescription"
                                                    className="form-label fw-semibold mt-2"
                                                >
                                                    Long Description
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <textarea
                                                    className="form-control"
                                                    id="longDescription"
                                                    name="longDescription"
                                                    rows="4"
                                                    value={
                                                        formData.longDescription
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Enter detailed description"
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* MRP */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="mrp"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    MRP (₹)
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="mrp"
                                                    name="mrp"
                                                    value={formData.mrp}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Selling Price */}
                                        <div className="row mb-3 align-items-center">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="sellingPrice"
                                                    className="form-label fw-semibold m-0"
                                                >
                                                    Selling Price (₹)
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="sellingPrice"
                                                    name="sellingPrice"
                                                    value={
                                                        formData.sellingPrice
                                                    }
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Service Image Preview and Selection */}
                                        <div className="row mb-4 align-items-start">
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="image"
                                                    className="form-label fw-semibold mt-2"
                                                >
                                                    Service Image
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                {imagePreview && (
                                                    <div className="mb-2">
                                                        <p className="text-muted small mb-1">
                                                            Current Display
                                                            Image:
                                                        </p>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="img-thumbnail"
                                                            style={{
                                                                width: "120px",
                                                                height: "120px",
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="image"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <small className="text-muted d-block mt-1">
                                                    Leave empty if you don't
                                                    want to replace the current
                                                    image.
                                                </small>
                                            </div>
                                        </div>

                                        {/* Toggle Switch */}
                                        <div className="row mb-4 align-items-center">
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold m-0">
                                                    Status
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id="flexSwitch"
                                                        name="status"
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "2.5em",
                                                            height: "1.25em",
                                                        }}
                                                        checked={
                                                            formData.status
                                                        }
                                                        onChange={
                                                            handleSwitchChange
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label text-muted small"
                                                        htmlFor="flexSwitch"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {formData.status
                                                            ? "Active (Visible)"
                                                            : "Inactive (Hidden)"}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Execution Buttons */}
                                        <div className="d-flex justify-content-center gap-3">
                                            <button
                                                type="submit"
                                                className="btn px-5"
                                                style={{
                                                    background: "#2d6a4f",
                                                    color: "white",
                                                }}
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary px-5"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditService;
