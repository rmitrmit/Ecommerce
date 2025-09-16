/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";
import { API_BASE } from "../utils/api";

const ProductCard = memo(({ product, onAddToCart }) => {
    const { id, name, price, mainImage, images, rating, sold, badges } =
        product;

    // Use mainImage or first image from images array
    const image = mainImage || (images && images[0]);

    // Check if image already has full URL or is relative path
    const imageSrc = image
        ? image.startsWith("http")
            ? image
            : `${API_BASE}/${image}`
        : `${API_BASE}/uploads/products/default-product.png`;

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                border: "1px solid rgba(0,0,0,0.05)",
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
            }}
        >
            <div style={{ position: "relative" }}>
                {Array.isArray(badges) && badges.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            zIndex: 2,
                        }}
                    >
                        {badges.map((b) => (
                            <span
                                key={b.text}
                                style={{
                                    background:
                                        b.type === "sale"
                                            ? "#ff6b35"
                                            : "#00a651",
                                    color: "#fff",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    fontSize: 10,
                                    fontWeight: 600,
                                    marginRight: 4,
                                }}
                            >
                                {b.text}
                            </span>
                        ))}
                    </div>
                )}
                <Link to={`/products/${id}`}>
                    <LazyImage
                        src={imageSrc}
                        alt={name}
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                        }}
                        placeholder="Loading..."
                    />
                </Link>
            </div>
            <div style={{ padding: 16 }}>
                <Link
                    to={`/products/${id}`}
                    style={{
                        textDecoration: "none",
                        color: "#333",
                    }}
                >
                    <h3
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            margin: "0 0 8px 0",
                            lineHeight: 1.4,
                            height: "40px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {name}
                    </h3>
                </Link>
                <div
                    style={{
                        color: "#ff6b35",
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 8,
                    }}
                >
                    {price?.toLocaleString()}₫
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                        fontSize: 12,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: 8,
                        }}
                    >
                        {["s1", "s2", "s3", "s4", "s5"].map((key, i) => (
                            <i
                                key={key}
                                className={
                                    "fa " +
                                    (i < Math.round(rating || 0)
                                        ? "fa-star"
                                        : "fa-star-o")
                                }
                                style={{
                                    color:
                                        i < Math.round(rating || 0)
                                            ? "#ffc107"
                                            : "#ddd",
                                    fontSize: 10,
                                    marginRight: 1,
                                }}
                            ></i>
                        ))}
                    </div>
                    {typeof sold === "number" && (
                        <span style={{ color: "#999" }}>Sold {sold}</span>
                    )}
                </div>
                <button
                    style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
                    }}
                    onClick={() => onAddToCart?.(product)}
                    onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow =
                            "0 4px 12px rgba(255, 107, 53, 0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                            "0 2px 8px rgba(255, 107, 53, 0.3)";
                    }}
                >
                    <i
                        className="fa fa-shopping-cart"
                        style={{ marginRight: 8 }}
                    ></i>
                    Add to cart
                </button>
            </div>
        </div>
    );
});

export default ProductCard;

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number,
        mainImage: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.number,
        sold: PropTypes.number,
        badges: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                type: PropTypes.string,
            })
        ),
    }).isRequired,
    onAddToCart: PropTypes.func,
};
