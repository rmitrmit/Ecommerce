/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/SkeletonLoader";
import { setFilters, clearFilters } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { useProducts } from "../hooks/useProducts";
import { useToastContext } from "../contexts/ToastContext";

const Products = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const toast = useToastContext();
    const { filters } = useSelector((state) => state.products);

    // Lấy parameters từ URL query
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get("category");
    const searchFromUrl = urlParams.get("search");

    const [searchTerm, setSearchTerm] = useState(
        searchFromUrl || filters.searchTerm || ""
    );
    const [appliedSearchTerm, setAppliedSearchTerm] = useState(
        searchFromUrl || filters.searchTerm || ""
    );
    const [minPrice, setMinPrice] = useState(filters.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
    const [selectedCategory, setSelectedCategory] = useState(
        categoryFromUrl || ""
    );

    // Use custom hook for products
    const { products, loading, error, hasMore, loadMore, refresh } =
        useProducts({
            category: selectedCategory,
            search: appliedSearchTerm,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        });

    // Auto search when debounced search term changes (disabled for now)
    // useEffect(() => {
    //     if (debouncedSearchTerm !== (filters.searchTerm || "")) {
    //         dispatch(
    //             setFilters({
    //                 searchTerm: debouncedSearchTerm,
    //                 minPrice: minPrice ? parseFloat(minPrice) : null,
    //                 maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    //             })
    //         );
    //         refresh();
    //     }
    // }, [
    //     debouncedSearchTerm,
    //     dispatch,
    //     filters.searchTerm,
    //     minPrice,
    //     maxPrice,
    //     refresh,
    // ]);

    // Update filters when URL changes
    useEffect(() => {
        if (categoryFromUrl !== selectedCategory) {
            setSelectedCategory(categoryFromUrl || "");
        }
        if (searchFromUrl !== appliedSearchTerm) {
            setSearchTerm(searchFromUrl || "");
            setAppliedSearchTerm(searchFromUrl || "");
        }
    }, [categoryFromUrl, searchFromUrl, selectedCategory, appliedSearchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setAppliedSearchTerm(searchTerm);
        dispatch(
            setFilters({
                searchTerm: searchTerm,
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            })
        );
        // Update URL with search parameters
        const params = new URLSearchParams();
        if (searchTerm) params.set("search", searchTerm);
        if (selectedCategory) params.set("category", selectedCategory);
        const newUrl = params.toString()
            ? `/products?${params.toString()}`
            : "/products";
        window.history.pushState({}, "", newUrl);
        refresh(); // Refresh products with new filters
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setAppliedSearchTerm("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedCategory("");
        dispatch(clearFilters());
        // Update URL to remove search parameters
        window.history.pushState({}, "", "/products");
        refresh(); // Refresh products
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product.id, quantity: 1 }));
        toast.success("Added to cart!");
    };

    // Client-side sorting
    const [sortKey, setSortKey] = useState("newest");

    const sorted = [...products].sort((a, b) => {
        if (sortKey === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortKey === "price_desc") return (b.price || 0) - (a.price || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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
                                        justifyContent: "space-between",
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
                                            {selectedCategory
                                                ? `Product - ${selectedCategory}`
                                                : "Product"}
                                        </h3>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <select
                                            value={sortKey}
                                            onChange={(e) =>
                                                setSortKey(e.target.value)
                                            }
                                            style={{
                                                padding: "8px 12px",
                                                border: "1px solid #ddd",
                                                borderRadius: 4,
                                                background: "#fff",
                                                fontSize: 14,
                                            }}
                                        >
                                            <option value="newest">
                                                Newest
                                            </option>
                                            <option value="price_asc">
                                                Price low to high
                                            </option>
                                            <option value="price_desc">
                                                Price high to low
                                            </option>
                                        </select>
                                        {selectedCategory && (
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory("");
                                                    window.history.pushState(
                                                        {},
                                                        "",
                                                        "/products"
                                                    );
                                                    window.location.reload();
                                                }}
                                                style={{
                                                    padding: "8px 12px",
                                                    border: "1px solid #ff6b35",
                                                    borderRadius: 4,
                                                    background: "#fff",
                                                    color: "#ff6b35",
                                                    fontSize: 14,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Clear categories filter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="row" style={{ marginBottom: 24 }}>
                        <div className="col-md-12">
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    padding: 32,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <form onSubmit={handleSearch}>
                                    <div
                                        className="row"
                                        style={{
                                            alignItems: "center",
                                            gap: "12px",
                                        }}
                                    >
                                        {/* Search Input */}
                                        <div className="col-md-4">
                                            <div
                                                style={{ position: "relative" }}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Search product..."
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        width: "100%",
                                                        height: 48,
                                                        padding:
                                                            "12px 16px 12px 48px",
                                                        border: "2px solid #e8e8e8",
                                                        borderRadius: 10,
                                                        fontSize: 14,
                                                        outline: "none",
                                                        transition:
                                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        background: "#fafafa",
                                                        fontWeight: 400,
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#ff6b35";
                                                        e.target.style.background =
                                                            "white";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 4px rgba(255, 107, 53, 0.1)";
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e8e8e8";
                                                        e.target.style.background =
                                                            "#fafafa";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                />
                                                <i
                                                    className="fa fa-search"
                                                    style={{
                                                        position: "absolute",
                                                        left: 16,
                                                        top: "50%",
                                                        transform:
                                                            "translateY(-50%)",
                                                        color: "#999",
                                                        fontSize: 16,
                                                        transition:
                                                            "color 0.3s",
                                                    }}
                                                ></i>
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="col-md-5">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <input
                                                    type="number"
                                                    placeholder="Price from"
                                                    value={minPrice}
                                                    onChange={(e) =>
                                                        setMinPrice(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        height: 48,
                                                        padding: "12px 14px",
                                                        border: "2px solid #e8e8e8",
                                                        borderRadius: 10,
                                                        fontSize: 14,
                                                        outline: "none",
                                                        transition:
                                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        background: "#fafafa",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#ff6b35";
                                                        e.target.style.background =
                                                            "white";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 4px rgba(255, 107, 53, 0.1)";
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e8e8e8";
                                                        e.target.style.background =
                                                            "#fafafa";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: "#999",
                                                        fontSize: 16,
                                                        fontWeight: 500,
                                                        minWidth: "16px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    -
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="Price to"
                                                    value={maxPrice}
                                                    onChange={(e) =>
                                                        setMaxPrice(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        height: 48,
                                                        padding: "12px 14px",
                                                        border: "2px solid #e8e8e8",
                                                        borderRadius: 10,
                                                        fontSize: 14,
                                                        outline: "none",
                                                        transition:
                                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        background: "#fafafa",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#ff6b35";
                                                        e.target.style.background =
                                                            "white";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 4px rgba(255, 107, 53, 0.1)";
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e8e8e8";
                                                        e.target.style.background =
                                                            "#fafafa";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Search Button */}
                                        <div className="col-md-3">
                                            <button
                                                type="submit"
                                                style={{
                                                    width: "100%",
                                                    height: 48,
                                                    background:
                                                        "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: 10,
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 6,
                                                    transition:
                                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    boxShadow:
                                                        "0 3px 12px rgba(255, 107, 53, 0.3)",
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(-1px)";
                                                    e.target.style.boxShadow =
                                                        "0 6px 20px rgba(255, 107, 53, 0.4)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                    e.target.style.boxShadow =
                                                        "0 3px 12px rgba(255, 107, 53, 0.3)";
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(-1px)";
                                                    e.target.style.boxShadow =
                                                        "0 6px 20px rgba(255, 107, 53, 0.4)";
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                    e.target.style.boxShadow =
                                                        "0 3px 12px rgba(255, 107, 53, 0.3)";
                                                }}
                                            >
                                                <i className="fa fa-search"></i>
                                               Search
                                            </button>
                                        </div>
                                    </div>

                                    {/* Clear Filters Button */}
                                    {(appliedSearchTerm ||
                                        minPrice ||
                                        maxPrice) && (
                                        <div
                                            className="row"
                                            style={{ marginTop: 16 }}
                                        >
                                            <div className="col-md-12 text-right">
                                                <button
                                                    type="button"
                                                    onClick={handleClearFilters}
                                                    style={{
                                                        height: 40,
                                                        padding: "0 20px",
                                                        background: "white",
                                                        color: "#666",
                                                        border: "2px solid #e8e8e8",
                                                        borderRadius: 8,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: 6,
                                                        transition: "all 0.3s",
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.borderColor =
                                                            "#ff6b35";
                                                        e.target.style.color =
                                                            "#ff6b35";
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e8e8e8";
                                                        e.target.style.color =
                                                            "#666";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#ff6b35";
                                                        e.target.style.color =
                                                            "#ff6b35";
                                                        e.target.style.transform =
                                                            "translateY(-1px)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e8e8e8";
                                                        e.target.style.color =
                                                            "#666";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                >
                                                    <i className="fa fa-times"></i>
                                                Clear filter
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="row">
                        {loading && (
                            <>
                                {[...Array(12)].map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="col-md-3 col-sm-6"
                                        style={{ marginBottom: 20 }}
                                    >
                                        <ProductCardSkeleton />
                                    </div>
                                ))}
                            </>
                        )}
                        {!loading && error && (
                            <div className="col-md-12 text-center">
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "40px 20px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 16,
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            color: "#e74c3c",
                                            fontSize: 16,
                                            margin: 0,
                                        }}
                                    >
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}
                        {!loading && !error && sorted.length === 0 && (
                            <div className="col-md-12 text-center">
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "40px 20px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 16,
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            color: "#666",
                                            fontSize: 16,
                                            margin: 0,
                                        }}
                                    >
                                        No product.
                                    </p>
                                </div>
                            </div>
                        )}
                        {!loading &&
                            !error &&
                            sorted.length > 0 &&
                            sorted.map((product) => (
                                <div
                                    key={product.id}
                                    className="col-md-3 col-sm-6"
                                    style={{ marginBottom: 20 }}
                                >
                                    <ProductCard
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            ))}
                    </div>

                    {!loading && !error && hasMore && (
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <button
                                    className="primary-btn"
                                    onClick={loadMore}
                                    disabled={loading}
                                    style={{
                                        opacity: loading ? 0.6 : 1,
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <i
                                                className="fa fa-spinner fa-spin"
                                                style={{ marginRight: 8 }}
                                            ></i>
                                            Loading...
                                        </>
                                    ) : (
                                        "More"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
