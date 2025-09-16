/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import VendorLayout from "../layouts/VendorLayout";

const VendorAddProduct = () => {
    const navigate = useNavigate();
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
    const [validationErrors, setValidationErrors] = useState({});

    // Redirect if not authenticated or not vendor
    React.useEffect(() => {
        if (
            !isAuthenticated ||
            (user?.role !== "vendor" && user?.role !== "Vendor")
        ) {
            navigate("/login");
            return;
        }
    }, [isAuthenticated, user?.role, navigate]);

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

        // Validate name (10-20 characters)
        if (!formData.name.trim()) {
            errors.name = "Product name is required";
        } else if (formData.name.trim().length < 10) {
            errors.name = "Product name must be at least 10 characters";
        } else if (formData.name.trim().length > 20) {
            errors.name = "Product name cannot exceed 20 characters";
        }

        // Validate price (positive number)
        if (!formData.price) {
            errors.price = "Product price is required";
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            errors.price = "Product price must be a positive number";
        }
        
        // Validate description (max 500 characters)
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
            errors.stock = "Stock quantity must be a non-negative number";
        }

        // Validate image
        if (!formData.image) {
            errors.image = "Product image is required";
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
            formDataToSend.append("image", formData.image);

            const response = await fetch(
                "http://localhost:3001/api/products/vendor/products",
                {
                    method: "POST",
                    body: formDataToSend,
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Error adding product"
                );
            }

            toast.success("Succesfully added product!");

            

            // Reset form
            setFormData({
                name: "",
                price: "",
                description: "",
                category: "",
                stock: "",
                image: null,
            });

            // Clear file input
            const fileInput = document.getElementById("image");
            if (fileInput) {
                fileInput.value = "";
            }

            // Redirect to vendor products page after 1 second
            setTimeout(() => {
                navigate("/vendor/dashboard");
            }, 1000);
        } catch (error) {
            toast.error(error.message || "Error adding product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VendorLayout>
            <div
                className="container"
                style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
                {/* Page Header */}
                <div className="row" style={{ marginBottom: "24px" }}>
                    <div className="col-md-12">
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            Add new product
                        </h2>
                        <p
                            style={{
                                margin: "8px 0 0 0",
                                fontSize: "14px",
                                color: "#666",
                            }}
                        >
                            Create new product for your business
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Form Header */}
                            <div
                                style={{
                                    backgroundColor: "#fafafa",
                                    padding: "16px 24px",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Product information
                                </h4>
                                <p
                                    style={{
                                        margin: "4px 0 0 0",
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    Fill in the information about your product
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                style={{ padding: "24px" }}
                            >
                                {/* Product Name */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        htmlFor="name"
                                        style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            marginBottom: "6px",
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
                                        placeholder="Enter product name"
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
                                            color: "#666",
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
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            marginBottom: "6px",
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
                                                padding: "12px 40px 12px 12px",
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
                                                color: "#666",
                                                fontSize: "14px",
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
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            marginBottom: "6px",
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
                                            minHeight: "120px",
                                            resize: "vertical",
                                            transition: "border-color 0.3s",
                                        }}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter product description (max 500 characters)"
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
                                            color:
                                                formData.description.length >
                                                500
                                                    ? "#ff4d4f"
                                                    : "#666",
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
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                marginBottom: "6px",
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
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                marginBottom: "6px",
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
                                <div style={{ marginBottom: "24px" }}>
                                    <label
                                        htmlFor="image"
                                        style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            marginBottom: "6px",
                                            color: "#333",
                                        }}
                                    >
                                        Product image *
                                    </label>
                                    <div
                                        style={{
                                            border: "2px dashed #d9d9d9",
                                            borderRadius: "6px",
                                            padding: "20px",
                                            textAlign: "center",
                                            transition: "border-color 0.3s",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            document
                                                .getElementById("image")
                                                .click()
                                        }
                                        onMouseOver={(e) => {
                                            e.target.style.borderColor =
                                                "#ee4d2d";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.borderColor =
                                                "#d9d9d9";
                                        }}
                                    >
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                        {formData.image ? (
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "48px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    📷
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#333",
                                                    }}
                                                >
                                                    {formData.image.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    Select another image
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "48px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    📁
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#333",
                                                    }}
                                                >
                                                    Select image
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    Supported files: JPG, PNG, GIF
                                                </div>
                                            </div>
                                        )}
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
                                        textAlign: "center",
                                        paddingTop: "24px",
                                        borderTop: "1px solid #e0e0e0",
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
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            transition: "background-color 0.3s",
                                            marginRight: "12px",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!loading) {
                                                e.target.style.backgroundColor =
                                                    "#d73502";
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!loading) {
                                                e.target.style.backgroundColor =
                                                    "#ee4d2d";
                                            }
                                        }}
                                    >
                                        {loading
                                            ? "Loading..."
                                            : "Add product"}
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
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "all 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.borderColor =
                                                "#ee4d2d";
                                            e.target.style.color = "#ee4d2d";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.borderColor =
                                                "#d9d9d9";
                                            e.target.style.color = "#666";
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

export default VendorAddProduct;
