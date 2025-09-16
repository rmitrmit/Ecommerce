/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import { API_BASE, getJson } from "../utils/api";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/SkeletonLoader";
import { ApiErrorDisplay } from "../components/ErrorBoundary";
import { useSimpleProducts } from "../hooks/useSimpleApi";
import { useToastContext } from "../contexts/ToastContext";

const HomeNew = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const cartHook = useCart();
    const [bannerIdx, setBannerIdx] = useState(0);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const toast = useToastContext();

    // Only use cart functions when authenticated
    const addItem = isAuthenticated ? cartHook.addItem : null;

    const {
        data: productsData,
        loading: productsLoading,
        error: productsError,
    } = useSimpleProducts();

    const banners = [
        `${API_BASE}/uploads/products/banner-1.jfif`,
        `${API_BASE}/uploads/products/banner-2.jfif`,
        `${API_BASE}/uploads/products/banner-3.jfif`,
    ];

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getJson("/api/products/categories");
                const fetchedCategories = data?.categories || [];

                // Fallback categories if API returns empty or fails
                if (fetchedCategories.length === 0) {
                    setCategories([
                        "Computer",
                        "Laptop",
                        "Headphones",
                        "TV",
                        "electronics",
                        "Phone",
                    ]);
                } else {
                    setCategories(fetchedCategories);
                }
            } catch (error) {
                // Fallback categories on error
                setCategories([
                    "Computer",
                    "Laptop",
                    "Headphones",
                    "TV",
                    "electronics",
                    "Phone",
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Auto-rotate banner
    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIdx((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    // Handle add to cart
    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            toast.warning(
                "Please login with an account.",
                "Login to add to cart"
            );
            return;
        }

        if (!addItem) {
            toast.error("Error");
            return;
        }

        addItem(product, 1);
        toast.success("Added item to cart!");
    };

    // Memoized products
    const products = useMemo(() => {
        return productsData || [];
    }, [productsData]);

    if (productsError) {
        return <ApiErrorDisplay error={productsError} />;
    }

    return (
        <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    
                    /* Custom scrollbar for categories */
                    .categories-scroll::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    .categories-scroll::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 2px;
                    }
                    
                    .categories-scroll::-webkit-scrollbar-thumb {
                        background: #ff6b35;
                        border-radius: 2px;
                    }
                    
                    .categories-scroll::-webkit-scrollbar-thumb:hover {
                        background: #e55a2b;
                    }
                `}
            </style>
            {/* Hero Banner Section */}
            <section style={{ padding: "20px 0", backgroundColor: "#fff" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div
                                style={{
                                    position: "relative",
                                    height: "300px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage: `url(${banners[bannerIdx]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        width: "100%",
                                        height: "100%",
                                        transition:
                                            "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background:
                                            "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1))",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "40px",
                                    }}
                                >
                                    <div>
                                        <h1
                                            style={{
                                                fontSize: "2.5rem",
                                                fontWeight: "700",
                                                color: "#fff",
                                                marginBottom: "16px",
                                                textShadow:
                                                    "0 2px 4px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            Explore our selection!
                                        </h1>
                                        <p
                                            style={{
                                                fontSize: "1.1rem",
                                                color: "#fff",
                                                marginBottom: "24px",
                                                opacity: 0.9,
                                            }}
                                        >
                                            Hundreds of products at reasonable prices
                                        </p>
                                        <Link
                                            to="/products"
                                            style={{
                                                display: "inline-block",
                                                background:
                                                    "linear-gradient(135deg, #ff6b35, #f7931e)",
                                                color: "#fff",
                                                padding: "12px 32px",
                                                borderRadius: "25px",
                                                textDecoration: "none",
                                                fontWeight: "600",
                                                fontSize: "1rem",
                                                boxShadow:
                                                    "0 4px 15px rgba(255, 107, 53, 0.4)",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transform =
                                                    "translateY(-2px)";
                                                e.target.style.boxShadow =
                                                    "0 6px 20px rgba(255, 107, 53, 0.6)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.transform =
                                                    "translateY(0)";
                                                e.target.style.boxShadow =
                                                    "0 4px 15px rgba(255, 107, 53, 0.4)";
                                            }}
                                        >
                                            Shop now
                                        </Link>
                                    </div>
                                </div>

                                {/* Banner indicators */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        display: "flex",
                                        gap: "8px",
                                    }}
                                >
                                    {banners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setBannerIdx(index)}
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                border: "none",
                                                background:
                                                    index === bannerIdx
                                                        ? "#fff"
                                                        : "rgba(255,255,255,0.5)",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Categories */}
                        <div className="col-md-4">
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "16px",
                                        textAlign: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    Categories
                                </h3>
                                {categoriesLoading ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }}
                                    >
                                        {[...Array(6)].map((_, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    height: "40px",
                                                    background: "#f0f0f0",
                                                    borderRadius: "8px",
                                                    animation:
                                                        "pulse 1.5s ease-in-out infinite",
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : categories.length > 0 ? (
                                    <div
                                        className="categories-scroll"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                            flex: 1,
                                            overflowY: "auto",
                                            maxHeight: "280px",
                                            paddingRight: "4px",
                                        }}
                                    >
                                        {categories.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/products?category=${encodeURIComponent(
                                                    category
                                                )}`}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "10px 14px",
                                                    borderRadius: "6px",
                                                    textDecoration: "none",
                                                    color: "#333",
                                                    transition: "all 0.3s ease",
                                                    border: "1px solid #e9ecef",
                                                    background: "#fff",
                                                    fontSize: "0.85rem",
                                                    fontWeight: "500",
                                                    minHeight: "38px",
                                                    flexShrink: 0,
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background =
                                                        "#f8f9fa";
                                                    e.target.style.borderColor =
                                                        "#ff6b35";
                                                    e.target.style.transform =
                                                        "translateX(4px)";
                                                    e.target.style.boxShadow =
                                                        "0 2px 8px rgba(255, 107, 53, 0.2)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background =
                                                        "#fff";
                                                    e.target.style.borderColor =
                                                        "#e9ecef";
                                                    e.target.style.transform =
                                                        "translateX(0)";
                                                    e.target.style.boxShadow =
                                                        "none";
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "5px",
                                                        height: "5px",
                                                        borderRadius: "50%",
                                                        background: "#ff6b35",
                                                        marginRight: "10px",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        flex: 1,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {category}
                                                </span>
                                                <i
                                                    className="fa fa-chevron-right"
                                                    style={{
                                                        fontSize: "0.6rem",
                                                        color: "#999",
                                                        marginLeft: "6px",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "20px",
                                            color: "#666",
                                        }}
                                    >
                                        <p>No categories</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section style={{ padding: "40px 0" }}>
                <div className="container">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "32px",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontSize: "1.8rem",
                                    fontWeight: "700",
                                    color: "#333",
                                    margin: 0,
                                }}
                            >
                                Highlighted products
                            </h2>
                            <p
                                style={{
                                    fontSize: "0.95rem",
                                    color: "#666",
                                    margin: "8px 0 0 0",
                                }}
                            >
                                Favorite items
                            </p>
                        </div>
                        <Link
                            to="/products"
                            style={{
                                color: "#ff6b35",
                                textDecoration: "none",
                                fontSize: "0.95rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = "translateX(4px)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = "translateX(0)";
                            }}
                        >
                            Browse all
                            <i
                                className="fa fa-arrow-right"
                                style={{ fontSize: "0.8rem" }}
                            />
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="row">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="col-md-3 col-sm-6"
                                    style={{ marginBottom: "24px" }}
                                >
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="row">
                            {products.map((p) => (
                                <div
                                    key={p.id}
                                    className="col-md-3 col-sm-6"
                                    style={{ marginBottom: "24px" }}
                                >
                                    <ProductCard
                                        product={p}
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!productsLoading && products.length === 0 && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                background: "#fff",
                                borderRadius: "12px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "16px",
                                }}
                            >
                                📦
                            </div>
                            <h3 style={{ color: "#333", marginBottom: "8px" }}>
                                No products
                            </h3>
                            <p style={{ color: "#666" }}>
                                Please try again
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomeNew;
