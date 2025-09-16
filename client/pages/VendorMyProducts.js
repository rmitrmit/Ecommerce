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
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../contexts/ToastContext";
import { getJson, deleteJson, API_BASE } from "../utils/api";
import VendorLayout from "../layouts/VendorLayout";

const VendorMyProducts = () => {
    const navigate = useNavigate();
    const toast = useToastContext();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getJson("/api/products/vendor/products");
                setProducts(data.products || []);
            } catch (error) {
                setError(
                    error.message || "Error"
                );
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        if (
            isAuthenticated &&
            (user?.role === "vendor" || user?.role === "Vendor")
        ) {
            fetchProducts();
        }
    }, [isAuthenticated, user?.role]);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            setDeletingId(productToDelete._id);
            await deleteJson(
                `/api/products/vendor/products/${productToDelete._id}`
            );

            // Remove product from local state
            setProducts((prev) =>
                prev.filter((product) => product._id !== productToDelete._id)
            );
            toast.success("Deleted product!");
        } catch (error) {
            toast.error(error.message || "Error");
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const handleRetry = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getJson("/api/products/vendor/products");
            setProducts(data.products || []);
        } catch (error) {
            setError(
                error.message || "Error"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const LoadingSkeleton = () => (
        <div
            style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}
        >
            <div className="row align-items-center">
                <div className="col-md-2">
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "6px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <div
                        style={{
                            height: "20px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                    <div
                        style={{
                            height: "16px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            width: "80%",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                </div>
                <div className="col-md-2">
                    <div
                        style={{
                            height: "20px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                </div>
                <div className="col-md-2">
                    <div
                        style={{
                            height: "16px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            marginBottom: "4px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                    <div
                        style={{
                            height: "14px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                </div>
                <div className="col-md-2">
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                        }}
                    >
                        <div
                            style={{
                                width: "60px",
                                height: "32px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                animation: "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                        <div
                            style={{
                                width: "60px",
                                height: "32px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                animation: "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <VendorLayout>
                <div
                    className="container"
                    style={{ paddingTop: "24px", paddingBottom: "24px" }}
                >
                    {/* Page Header */}
                    <div className="row" style={{ marginBottom: "24px" }}>
                        <div className="col-md-12">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    My products
                                </h2>
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
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row" style={{ marginBottom: "24px" }}>
                        <div className="col-md-12">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        height: "20px",
                                        backgroundColor: "#f0f0f0",
                                        borderRadius: "4px",
                                        width: "200px",
                                        margin: "0 auto",
                                        animation:
                                            "pulse 1.5s ease-in-out infinite",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products List Skeleton */}
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    overflow: "hidden",
                                }}
                            >
                                {[1, 2, 3].map((i) => (
                                    <LoadingSkeleton key={i} />
                                ))}
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
                                    Cannot load product list
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
                                <button
                                    onClick={handleRetry}
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
                {/* Page Header */}
                <div className="row" style={{ marginBottom: "24px" }}>
                    <div className="col-md-12">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "600",
                                    color: "#333",
                                }}
                            >
                                My products
                            </h2>
                            <button
                                onClick={() => navigate("/vendor/add-product")}
                                style={{
                                    backgroundColor: "#ee4d2d",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#d73502";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "#ee4d2d";
                                }}
                            >
                                + Add new product
                            </button>
                        </div>
                    </div>
                </div>
                {/* Stats */}
                <div className="row" style={{ marginBottom: "24px" }}>
                    <div className="col-md-12">
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                textAlign: "center",
                            }}
                        >
                            <h4
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#333",
                                }}
                            >
                                Total {products.length} products
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                            }}
                        >
                            {products.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "60px 20px",
                                        color: "#666",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "64px",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        📦
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "18px",
                                            marginBottom: "8px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        No products
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "14px",
                                            marginBottom: "24px",
                                        }}
                                    >
                                        Add your first product
                                    </div>
                                    <button
                                        onClick={() =>
                                            navigate("/vendor/add-product")
                                        }
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
                                        Add product
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: "0" }}>
                                    {products.map((product) => (
                                        <div
                                            key={product._id}
                                            style={{
                                                padding: "20px 24px",
                                                borderBottom:
                                                    "1px solid #f0f0f0",
                                                transition:
                                                    "background-color 0.3s",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    "#fafafa";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    "white";
                                            }}
                                        >
                                            <div className="row align-items-center">
                                                {/* Product Image */}
                                                <div className="col-md-2">
                                                    <img
                                                        src={
                                                            product.images &&
                                                            product.images
                                                                .length > 0
                                                                ? product.images[0].startsWith(
                                                                      "http"
                                                                  )
                                                                    ? product
                                                                          .images[0]
                                                                    : `${API_BASE}/${product.images[0]}`
                                                                : `${API_BASE}/uploads/products/default-product.png`
                                                        }
                                                        alt={
                                                            product.name ||
                                                            "Product name"
                                                        }
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                            border: "1px solid #e0e0e0",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = `${API_BASE}/uploads/products/default-product.png`;
                                                        }}
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="col-md-4">
                                                    <div
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            color: "#333",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {product.name ||
                                                            "Product name"}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#ee4d2d",
                                                            marginBottom: "4px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {product.category ||
                                                            "No category"}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            lineHeight: "1.4",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {product.description ||
                                                            "No description"}
                                                    </div>
                                                </div>

                                                {/* Price and Stock */}
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "18px",
                                                            fontWeight: "600",
                                                            color: "#ee4d2d",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            product.price || 0
                                                        )}
                                                        ₫
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        Stock:{" "}
                                                        {product.stock || 0}
                                                    </div>
                                                </div>

                                                {/* Created Date */}
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Date created
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {formatDate(
                                                            product.createdAt ||
                                                                new Date()
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                            justifyContent:
                                                                "flex-end",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/vendor/edit-product/${product._id}`
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#1890ff",
                                                                color: "white",
                                                                border: "none",
                                                                padding:
                                                                    "6px 12px",
                                                                borderRadius:
                                                                    "4px",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "500",
                                                                cursor: "pointer",
                                                                transition:
                                                                    "background-color 0.3s",
                                                            }}
                                                            onMouseOver={(
                                                                e
                                                            ) => {
                                                                e.target.style.backgroundColor =
                                                                    "#40a9ff";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.backgroundColor =
                                                                    "#1890ff";
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    product
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                product._id
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    deletingId ===
                                                                    product._id
                                                                        ? "#ccc"
                                                                        : "#ff4d4f",
                                                                color: "white",
                                                                border: "none",
                                                                padding:
                                                                    "6px 12px",
                                                                borderRadius:
                                                                    "4px",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "500",
                                                                cursor:
                                                                    deletingId ===
                                                                    product._id
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                transition:
                                                                    "background-color 0.3s",
                                                            }}
                                                            onMouseOver={(
                                                                e
                                                            ) => {
                                                                if (
                                                                    deletingId !==
                                                                    product._id
                                                                ) {
                                                                    e.target.style.backgroundColor =
                                                                        "#ff7875";
                                                                }
                                                            }}
                                                            onMouseOut={(e) => {
                                                                if (
                                                                    deletingId !==
                                                                    product._id
                                                                ) {
                                                                    e.target.style.backgroundColor =
                                                                        "#ff4d4f";
                                                                }
                                                            }}
                                                        >
                                                            {deletingId ===
                                                            product._id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={handleDeleteCancel}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "24px",
                            maxWidth: "400px",
                            width: "90%",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "24px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "48px",
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
                                Confirm product deletion
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#666",
                                    lineHeight: "1.5",
                                }}
                            >
                                Are you sure you want to delete product{" "}
                                <strong>{productToDelete?.name}</strong>? This action is irreversible.
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={handleDeleteCancel}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#666",
                                    border: "1px solid #d9d9d9",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#f5f5f5";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor =
                                        "transparent";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deletingId === productToDelete?._id}
                                style={{
                                    backgroundColor:
                                        deletingId === productToDelete?._id
                                            ? "#ccc"
                                            : "#ff4d4f",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor:
                                        deletingId === productToDelete?._id
                                            ? "not-allowed"
                                            : "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    if (deletingId !== productToDelete?._id) {
                                        e.target.style.backgroundColor =
                                            "#ff7875";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (deletingId !== productToDelete?._id) {
                                        e.target.style.backgroundColor =
                                            "#ff4d4f";
                                    }
                                }}
                            >
                                {deletingId === productToDelete?._id
                                    ? "Deleting..."
                                    : "Delete product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
};

export default VendorMyProducts;
