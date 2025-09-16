/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { API_BASE } from "../utils/api";

const Cart = () => {
    const { items, totalItems, totalAmount, updateItem, removeItem, clear } =
        useCart();

    // Cart is already fetched by App.js, no need to fetch again

    // Helper function to get product image URL
    const getProductImageUrl = (product) => {
        if (product.mainImage) {
            return product.mainImage.startsWith("http")
                ? product.mainImage
                : `${API_BASE}/${product.mainImage}`;
        }

        if (Array.isArray(product.images) && product.images.length) {
            return product.images[0].startsWith("http")
                ? product.images[0]
                : `${API_BASE}/${product.images[0]}`;
        }

        return `${API_BASE}/uploads/products/default-product.png`;
    };

    const handleRemoveItem = (productId) => {
        removeItem(productId);
    };

    const handleUpdateQuantity = (productId, quantity) => {
        updateItem(productId, quantity);
    };

    const handleClearCart = () => {
        clear();
    };

    const formatCurrency = (n) =>
        (n || 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });

    return (
        <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <div style={{ paddingTop: 20 }}>
                <div className="container">
                    {/* Header */}
                    <div className="row" style={{ marginBottom: 20 }}>
                        <div className="col-md-12">
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: 8,
                                    padding: 20,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 4,
                                            height: 24,
                                            background: "#ff6b35",
                                            borderRadius: 2,
                                            marginRight: 12,
                                        }}
                                    ></div>
                                    <h3
                                        style={{
                                            margin: 0,
                                            color: "#333",
                                            fontSize: 20,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Cart
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="row">
                            <div className="col-md-12">
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "60px 20px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 16,
                                        }}
                                    >
                                        🛒
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 16,
                                            color: "#666",
                                            margin: 0,
                                        }}
                                    >
                                        Your cart is empty
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-md-8">
                                    {items.map((item) => (
                                        <div
                                            key={item.product.id}
                                            style={{
                                                background: "#fff",
                                                borderRadius: 8,
                                                padding: 16,
                                                marginBottom: 16,
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <img
                                                        src={getProductImageUrl(
                                                            item.product
                                                        )}
                                                        alt={item.product.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "120px",
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-sm-9">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "flex-start",
                                                            marginBottom: 12,
                                                        }}
                                                    >
                                                        <div
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Link
                                                                to={`/products/${item.product.id}`}
                                                                style={{
                                                                    textDecoration:
                                                                        "none",
                                                                    color: "#333",
                                                                    fontSize: 16,
                                                                    fontWeight: 500,
                                                                    lineHeight: 1.4,
                                                                }}
                                                            >
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </Link>
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                    color: "#ff6b35",
                                                                    fontSize: 18,
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    item.product
                                                                        .price
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.product
                                                                        .id
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    "#ff4757",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius: 4,
                                                                padding:
                                                                    "6px 12px",
                                                                cursor: "pointer",
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 12,
                                                            }}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item
                                                                            .product
                                                                            .id,
                                                                        Math.max(
                                                                            1,
                                                                            item.quantity -
                                                                                1
                                                                        )
                                                                    )
                                                                }
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    border: "1px solid #ddd",
                                                                    background:
                                                                        "#fff",
                                                                    borderRadius: 4,
                                                                    cursor: "pointer",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                -
                                                            </button>
                                                            <span
                                                                style={{
                                                                    minWidth: 40,
                                                                    textAlign:
                                                                        "center",
                                                                    fontSize: 16,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item
                                                                            .product
                                                                            .id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    border: "1px solid #ddd",
                                                                    background:
                                                                        "#fff",
                                                                    borderRadius: 4,
                                                                    cursor: "pointer",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <div
                                                            style={{
                                                                color: "#333",
                                                                fontSize: 16,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Total:{" "}
                                                            {formatCurrency(
                                                                item.product
                                                                    .price *
                                                                    item.quantity
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-md-4">
                                    <div
                                        style={{
                                            background: "#fff",
                                            borderRadius: 8,
                                            padding: 20,
                                            boxShadow:
                                                "0 1px 3px rgba(0,0,0,0.1)",
                                            position: "sticky",
                                            top: 20,
                                        }}
                                    >
                                        <h4
                                            style={{
                                                marginTop: 0,
                                                marginBottom: 20,
                                                fontSize: 18,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Your order
                                        </h4>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 12,
                                                fontSize: 14,
                                            }}
                                        >
                                            <span style={{ color: "#666" }}>
                                                Number of products
                                            </span>
                                            <strong style={{ color: "#333" }}>
                                                {totalItems}
                                            </strong>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 12,
                                                fontSize: 14,
                                            }}
                                        >
                                            <span style={{ color: "#666" }}>
                                                
                                                Subtotal
                                            </span>
                                            <strong style={{ color: "#333" }}>
                                                {formatCurrency(totalAmount)}
                                            </strong>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 16,
                                                fontSize: 14,
                                            }}
                                        >
                                            <span style={{ color: "#666" }}>
                                                Shipping fee
                                            </span>
                                            <strong
                                                style={{ color: "#00a651" }}
                                            >
                                                Free
                                            </strong>
                                        </div>
                                        <hr
                                            style={{
                                                margin: "16px 0",
                                                border: "none",
                                                borderTop: "1px solid #eee",
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: 20,
                                                fontSize: 16,
                                            }}
                                        >
                                            <span style={{ fontWeight: 600 }}>
                                                Total
                                            </span>
                                            <strong
                                                style={{
                                                    color: "#ff6b35",
                                                    fontSize: 20,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {formatCurrency(totalAmount)}
                                            </strong>
                                        </div>
                                        <Link
                                            to="/checkout"
                                            style={{
                                                width: "100%",
                                                display: "block",
                                                textAlign: "center",
                                                background: "#ff6b35",
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "12px",
                                                borderRadius: 6,
                                                fontSize: 16,
                                                fontWeight: 500,
                                                marginBottom: 12,
                                                transition: "all 0.2s",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background =
                                                    "#e55a2b";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background =
                                                    "#ff6b35";
                                            }}
                                        >
                                            Checkout
                                        </Link>
                                        <button
                                            onClick={handleClearCart}
                                            style={{
                                                width: "100%",
                                                background: "#f5f5f5",
                                                color: "#666",
                                                border: "1px solid #ddd",
                                                borderRadius: 6,
                                                padding: "12px",
                                                fontSize: 14,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background =
                                                    "#eee";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background =
                                                    "#f5f5f5";
                                            }}
                                        >
                                            Delete cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
