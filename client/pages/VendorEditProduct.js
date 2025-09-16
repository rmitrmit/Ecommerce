/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import { getJson, putJson } from "../utils/api";
import VendorLayout from "../layouts/VendorLayout";

const VendorEditProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const toast = useToastContext();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Redirect if not authenticated or not vendor
    useEffect(() => {
        if (
            !isAuthenticated ||
            (user?.role !== "vendor" && user?.role !== "Vendor")
        ) {
            navigate("/login");
            return;
        }
    }, [isAuthenticated, user?.role, navigate]);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoadingProduct(true);
                setError(null);
                const data = await getJson(`/api/products/${productId}`, false);

                setFormData({
                    name: data.product.name || "",
                    price: data.product.price || "",
                    description: data.product.description || "",
                    category: data.product.category || "",
                    stock: data.product.stock || "",
                    image: null, // Keep as null for new upload
                });
            } catch (error) {
                setError(
                    error.message || "Error adding product"
                );
            } finally {
                setLoadingProduct(false);
            }
        };

        if (productId && isAuthenticated) {
            fetchProduct();
        }
    }, [productId, isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear validation error
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));

            // Clear validation error
            if (validationErrors.image) {
                setValidationErrors((prev) => ({
                    ...prev,
                    image: "",
                }));
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validate name
        if (!formData.name.trim()) {
            errors.name = "Product name is required";
        } else if (formData.name.trim().length < 10) {
            errors.name = "Product name must be at least 10 characters";
        } else if (formData.name.trim().length > 20) {
            errors.name = "Product name cannot exceed 20 characters";
        }
        
        // Validate price
        if (!formData.price) {
            errors.price = "Product price is required";
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            errors.price = "Product price must be a positive number";
        }
        
        // Validate description
        if (!formData.description.trim()) {
            errors.description = "Product description is required";
        } else if (formData.description.trim().length > 500) {
            errors.description = "Product description cannot exceed 500 characters";
        }
        
        // Validate category
        if (!formData.category.trim()) {
            errors.category = "Product category is required";
        } else if (formData.category.trim().length < 2) {
            errors.category = "Product category must be at least 2 characters";
        } else if (formData.category.trim().length > 50) {
            errors.category = "Product category cannot exceed 50 characters";
        }
        
        // Validate stock
        if (!formData.stock) {
            errors.stock = "Stock quantity is required";
        } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            errors.stock = "Stock quantity must be a non-negative integer";
        }        

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name.trim());
            formDataToSend.append("price", parseFloat(formData.price));
            formDataToSend.append("description", formData.description.trim());
            formDataToSend.append("category", formData.category.trim());
            formDataToSend.append("stock", parseInt(formData.stock));

            // Only append image if a new one was selected
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await fetch(
                `http://localhost:3001/api/products/vendor/products/${productId}`,
                {
                    method: "PUT",
                    body: formDataToSend,
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Error updating product"
                );
            }

            toast.success("Product updated!");

            // Redirect to vendor products page after 1 second
            setTimeout(() => {
                navigate("/vendor/dashboard");
            }, 1000);
        } catch (error) {
            toast.error(error.message || "Error updating product");
        } finally {
            setLoading(false);
        }
    };

    if (loadingProduct) {
        return (
            <VendorLayout>
                <div
                    className="container"
                    style={{ paddingTop: "24px", paddingBottom: "24px" }}
                >
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    padding: "32px",
                                }}
                            >
                                {/* Header Skeleton */}
                                <div
                                    style={{
                                        textAlign: "center",
                                        marginBottom: "32px",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "28px",
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "4px",
                                            width: "200px",
                                            margin: "0 auto 8px",
                                            animation:
                                                "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: "16px",
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "4px",
                                            width: "300px",
                                            margin: "0 auto",
                                            animation:
                                                "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                </div>

                                {/* Form Skeleton */}
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        style={{ marginBottom: "20px" }}
                                    >
                                        <div
                                            style={{
                                                height: "16px",
                                                backgroundColor: "#f0f0f0",
                                                borderRadius: "4px",
                                                width: "120px",
                                                marginBottom: "8px",
                                                animation:
                                                    "pulse 1.5s ease-in-out infinite",
                                            }}
                                        />
                                        <div
                                            style={{
                                                height: "40px",
                                                backgroundColor: "#f0f0f0",
                                                borderRadius: "6px",
                                                animation:
                                                    "pulse 1.5s ease-in-out infinite",
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* Button Skeleton */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        justifyContent: "center",
                                        marginTop: "32px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "150px",
                                            height: "40px",
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "6px",
                                            animation:
                                                "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: "100px",
                                            height: "40px",
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "6px",
                                            animation:
                                                "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    {`
                        @keyframes pulse {
                            0% { opacity: 1; }
                            50% { opacity: 0.5; }
                            100% { opacity: 1; }
                        }
                    `}
                </style>
            </VendorLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <VendorLayout>
                <div
                    className="container"
                    style={{ paddingTop: "24px", paddingBottom: "24px" }}
                >
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    padding: "40px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "64px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    ⚠️
                                </div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Cannot load product information
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        color: "#666",
                                        marginBottom: "24px",
                                    }}
                                >
                                    {error}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        onClick={() => window.location.reload()}
                                        style={{
                                            backgroundColor: "#ee4d2d",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 24px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor =
                                                "#d73502";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor =
                                                "#ee4d2d";
                                        }}
                                    >
                                        Try again
                                    </button>
                                    <button
                                        onClick={() =>
                                            navigate("/vendor/dashboard")
                                        }
                                        style={{
                                            backgroundColor: "transparent",
                                            color: "#666",
                                            border: "1px solid #d9d9d9",
                                            padding: "12px 24px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor =
                                                "#f5f5f5";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor =
                                                "transparent";
                                        }}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </VendorLayout>
        );
    }

    return (
        <VendorLayout>
            <div
                className="container"
                style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                padding: "32px",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: "32px",
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Edit product
                                </h2>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    Update product information
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Product Name */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        htmlFor="name"
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                        }}
                                    >
                                        Product name *
                                    </label>
                                    <input
                                        id="name"
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "1px solid #d9d9d9",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            transition: "border-color 0.3s",
                                        }}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product name (10-20 characters)"
                                        onFocus={(e) =>
                                            (e.target.style.borderColor =
                                                "#ee4d2d")
                                        }
                                        onBlur={(e) =>
                                            (e.target.style.borderColor =
                                                "#d9d9d9")
                                        }
                                    />
                                    {validationErrors.name && (
                                        <span
                                            style={{
                                                color: "#ff4d4f",
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                display: "block",
                                            }}
                                        >
                                            {validationErrors.name}
                                        </span>
                                    )}
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            marginTop: "4px",
                                        }}
                                    >
                                        {formData.name.length}/20 characters
                                    </div>
                                </div>

                                {/* Product Price */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        htmlFor="price"
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                        }}
                                    >
                                        Price *
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            id="price"
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                transition: "border-color 0.3s",
                                            }}
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="Enter product price"
                                            min="0"
                                            step="0.01"
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    "#ee4d2d")
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    "#d9d9d9")
                                            }
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                right: "12px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                fontSize: "14px",
                                                color: "#666",
                                            }}
                                        >
                                            ₫
                                        </span>
                                    </div>
                                    {validationErrors.price && (
                                        <span
                                            style={{
                                                color: "#ff4d4f",
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                display: "block",
                                            }}
                                        >
                                            {validationErrors.price}
                                        </span>
                                    )}
                                </div>

                                {/* Product Description */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        htmlFor="description"
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                        }}
                                    >
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "1px solid #d9d9d9",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            transition: "border-color 0.3s",
                                            resize: "vertical",
                                            minHeight: "100px",
                                        }}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter product description (Max 500 characters)"
                                        rows={5}
                                        onFocus={(e) =>
                                            (e.target.style.borderColor =
                                                "#ee4d2d")
                                        }
                                        onBlur={(e) =>
                                            (e.target.style.borderColor =
                                                "#d9d9d9")
                                        }
                                    />
                                    {validationErrors.description && (
                                        <span
                                            style={{
                                                color: "#ff4d4f",
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                display: "block",
                                            }}
                                        >
                                            {validationErrors.description}
                                        </span>
                                    )}
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            marginTop: "4px",
                                        }}
                                    >
                                        {formData.description.length}/500 characters
                                    </div>
                                </div>

                                {/* Category and Stock Row */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    {/* Category */}
                                    <div style={{ flex: 1 }}>
                                        <label
                                            htmlFor="category"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#333",
                                            }}
                                        >
                                            Category *
                                        </label>
                                        <input
                                            id="category"
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                transition: "border-color 0.3s",
                                            }}
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="Choose product category"
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    "#ee4d2d")
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    "#d9d9d9")
                                            }
                                        />
                                        {validationErrors.category && (
                                            <span
                                                style={{
                                                    color: "#ff4d4f",
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                    display: "block",
                                                }}
                                            >
                                                {validationErrors.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div style={{ flex: 1 }}>
                                        <label
                                            htmlFor="stock"
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#333",
                                            }}
                                        >
                                            Stock *
                                        </label>
                                        <input
                                            id="stock"
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                border: "1px solid #d9d9d9",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                transition: "border-color 0.3s",
                                            }}
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            placeholder="Enter stock"
                                            min="0"
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    "#ee4d2d")
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    "#d9d9d9")
                                            }
                                        />
                                        {validationErrors.stock && (
                                            <span
                                                style={{
                                                    color: "#ff4d4f",
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                    display: "block",
                                                }}
                                            >
                                                {validationErrors.stock}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Product Image */}
                                <div style={{ marginBottom: "32px" }}>
                                    <label
                                        htmlFor="image"
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                        }}
                                    >
                                        Image
                                    </label>
                                    <input
                                        id="image"
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "1px solid #d9d9d9",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            transition: "border-color 0.3s",
                                        }}
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        onFocus={(e) =>
                                            (e.target.style.borderColor =
                                                "#ee4d2d")
                                        }
                                        onBlur={(e) =>
                                            (e.target.style.borderColor =
                                                "#d9d9d9")
                                        }
                                    />
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginTop: "4px",
                                        }}
                                    >
                                        Choose new image (JPEG, PNG,
                                        GIF)
                                    </div>
                                    {validationErrors.image && (
                                        <span
                                            style={{
                                                color: "#ff4d4f",
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                display: "block",
                                            }}
                                        >
                                            {validationErrors.image}
                                        </span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            backgroundColor: loading
                                                ? "#ccc"
                                                : "#ee4d2d",
                                            color: "white",
                                            border: "none",
                                            padding: "12px 32px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : "Update product"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/vendor/dashboard")
                                        }
                                        style={{
                                            backgroundColor: "transparent",
                                            color: "#666",
                                            border: "1px solid #d9d9d9",
                                            padding: "12px 32px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor =
                                                "#f5f5f5";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor =
                                                "transparent";
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
};

export default VendorEditProduct;
