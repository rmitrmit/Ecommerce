/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { addToCart } from "../store/slices/cartSlice";
import { useToastContext } from "../contexts/ToastContext";
import { useProductDetail } from "../hooks/useProductDetail";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const toast = useToastContext();
    const [activeIdx, setActiveIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Use custom hook for product data
    const { product, loading, error } = useProductDetail(id);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ productId: product.id, quantity }));
            toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
                <div
                    className="container"
                    style={{ paddingTop: 20, paddingBottom: 40 }}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 8,
                                    height: "500px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            >
                                <i
                                    className="fa fa-spinner fa-spin"
                                    style={{
                                        fontSize: "2rem",
                                        color: "#ee4d2d",
                                    }}
                                ></i>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 8,
                                    padding: 24,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    height: "500px",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#f8f9fa",
                                        height: "40px",
                                        borderRadius: 4,
                                        marginBottom: 16,
                                    }}
                                ></div>
                                <div
                                    style={{
                                        background: "#f8f9fa",
                                        height: "30px",
                                        borderRadius: 4,
                                        marginBottom: 16,
                                        width: "60%",
                                    }}
                                ></div>
                                <div
                                    style={{
                                        background: "#f8f9fa",
                                        height: "100px",
                                        borderRadius: 4,
                                        marginBottom: 20,
                                    }}
                                ></div>
                                <div
                                    style={{
                                        background: "#f8f9fa",
                                        height: "50px",
                                        borderRadius: 4,
                                        width: "200px",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
                <div
                    className="container"
                    style={{ paddingTop: 20, paddingBottom: 40 }}
                >
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 8,
                                    padding: "60px 20px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 48,
                                        marginBottom: 16,
                                        color: "#ee4d2d",
                                    }}
                                >
                                    <i className="fa fa-exclamation-triangle"></i>
                                </div>
                                <h3
                                    style={{
                                        color: "#ee4d2d",
                                        marginBottom: 8,
                                        fontSize: 24,
                                    }}
                                >
                                    {error || "Product not found"}
                                </h3>
                                <p
                                    style={{
                                        color: "#666",
                                        fontSize: 16,
                                        marginBottom: 24,
                                    }}
                                >
                                    Please try again
                                </p>
                                <Link
                                    to="/products"
                                    style={{
                                        display: "inline-block",
                                        padding: "12px 24px",
                                        background: "#ee4d2d",
                                        color: "white",
                                        textDecoration: "none",
                                        borderRadius: 6,
                                        fontWeight: 600,
                                        transition: "all 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#d73502";
                                        e.target.style.transform =
                                            "translateY(-2px)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "#ee4d2d";
                                        e.target.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    <i
                                        className="fa fa-arrow-left"
                                        style={{ marginRight: 8 }}
                                    ></i>
                                    Back to products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            {/* Breadcrumb */}
            <div
                style={{
                    background: "white",
                    padding: "12px 0",
                    borderBottom: "1px solid #e9ecef",
                }}
            >
                <div className="container">
                    <nav style={{ fontSize: 14, color: "#666" }}>
                        <Link
                            to="/"
                            style={{ color: "#ee4d2d", textDecoration: "none" }}
                        >
                            Home
                        </Link>
                        <span style={{ margin: "0 8px" }}>/</span>
                        <Link
                            to="/products"
                            style={{ color: "#ee4d2d", textDecoration: "none" }}
                        >
                            Product
                        </Link>
                        <span style={{ margin: "0 8px" }}>/</span>
                        <span style={{ color: "#333" }}>{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Product Section */}
            <div
                className="container"
                style={{ paddingTop: 20, paddingBottom: 40 }}
            >
                <div className="row">
                    {/* Product Images */}
                    <div className="col-md-6">
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 16,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                marginBottom: 20,
                            }}
                        >
                            {/* Main Image */}
                            <div
                                style={{
                                    position: "relative",
                                    marginBottom: 16,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    background: "#f8f9fa",
                                }}
                            >
                                <img
                                    src={product.images[activeIdx]}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />
                                {/* Image Badge */}
                                
                            </div>

                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        overflowX: "auto",
                                        paddingBottom: 8,
                                    }}
                                >
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={img}
                                            type="button"
                                            onClick={() => setActiveIdx(idx)}
                                            style={{
                                                flex: "0 0 80px",
                                                height: "80px",
                                                border:
                                                    idx === activeIdx
                                                        ? "2px solid #ee4d2d"
                                                        : "1px solid #e9ecef",
                                                borderRadius: 6,
                                                background: "white",
                                                cursor: "pointer",
                                                padding: 0,
                                                overflow: "hidden",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseOver={(e) => {
                                                if (idx !== activeIdx) {
                                                    e.target.style.borderColor =
                                                        "#ee4d2d";
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (idx !== activeIdx) {
                                                    e.target.style.borderColor =
                                                        "#e9ecef";
                                                }
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name}-${idx}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-md-6">
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 24,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                marginBottom: 20,
                            }}
                        >
                            {/* Product Title */}
                            <h1
                                style={{
                                    fontSize: 24,
                                    fontWeight: 600,
                                    color: "#333",
                                    marginBottom: 16,
                                    lineHeight: 1.4,
                                }}
                            >
                                {product.name}
                            </h1>

                            {/* Price Section */}
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 700,
                                        color: "#ee4d2d",
                                        marginBottom: 8,
                                    }}
                                >
                                    {(product.price || 0).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    ₫
                                </div>
                                <div
                                    style={{
                                        fontSize: 14,
                                        color: "#666",
                                        textDecoration: "line-through",
                                    }}
                                >
                                    {(product.price * 1.2 || 0).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    ₫
                                </div>
                            </div>

                            {/* Product Description */}
                            <div style={{ marginBottom: 24 }}>
                                <h4
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 12,
                                    }}
                                >
                                    Product description
                                </h4>
                                <p
                                    style={{
                                        color: "#666",
                                        lineHeight: 1.6,
                                        fontSize: 14,
                                    }}
                                >
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div style={{ marginBottom: 24 }}>
                                <h4
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 12,
                                    }}
                                >
                                    Quantity
                                </h4>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(quantity - 1)
                                        }
                                        disabled={quantity <= 1}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            border: "1px solid #e9ecef",
                                            background: "white",
                                            borderRadius: 6,
                                            cursor:
                                                quantity <= 1
                                                    ? "not-allowed"
                                                    : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            color:
                                                quantity <= 1 ? "#ccc" : "#333",
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        min="1"
                                        max="99"
                                        style={{
                                            width: 80,
                                            height: 40,
                                            border: "1px solid #e9ecef",
                                            borderRadius: 6,
                                            textAlign: "center",
                                            fontSize: 16,
                                            fontWeight: 600,
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleQuantityChange(quantity + 1)
                                        }
                                        disabled={quantity >= 99}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            border: "1px solid #e9ecef",
                                            background: "white",
                                            borderRadius: 6,
                                            cursor:
                                                quantity >= 99
                                                    ? "not-allowed"
                                                    : "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            color:
                                                quantity >= 99
                                                    ? "#ccc"
                                                    : "#333",
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    onClick={handleAddToCart}
                                    style={{
                                        flex: 1,
                                        minWidth: "200px",
                                        height: 48,
                                        background:
                                            "linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        transition: "all 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform =
                                            "translateY(-2px)";
                                        e.target.style.boxShadow =
                                            "0 8px 25px rgba(238, 77, 45, 0.3)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform =
                                            "translateY(0)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                >
                                    <i className="fa fa-shopping-cart"></i>
                                    Add to cart
                                </button>
                                <button
                                    style={{
                                        flex: 1,
                                        minWidth: "200px",
                                        height: 48,
                                        background: "white",
                                        color: "#ee4d2d",
                                        border: "2px solid #ee4d2d",
                                        borderRadius: 6,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        transition: "all 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#ee4d2d";
                                        e.target.style.color = "white";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "white";
                                        e.target.style.color = "#ee4d2d";
                                    }}
                                >
                                    <i className="fa fa-heart"></i>
                                    Favorite
                                </button>
                            </div>
                        </div>

                        {/* Product Features */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 24,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: "#333",
                                    marginBottom: 16,
                                }}
                            >
                                Product information
                            </h4>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{ color: "#666", fontSize: 14 }}
                                    >
                                        Status
                                    </span>
                                    <span
                                        style={{
                                            color: "#28a745",
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        <i
                                            className="fa fa-check-circle"
                                            style={{ marginRight: 4 }}
                                        ></i>
                                        In stock
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{ color: "#666", fontSize: 14 }}
                                    >
                                        Warranty
                                    </span>
                                    <span
                                        style={{
                                            color: "#333",
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        12 months
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{ color: "#666", fontSize: 14 }}
                                    >
                                        Shipping
                                    </span>
                                    <span
                                        style={{
                                            color: "#28a745",
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        <i
                                            className="fa fa-truck"
                                            style={{ marginRight: 4 }}
                                        ></i>
                                        Free
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
