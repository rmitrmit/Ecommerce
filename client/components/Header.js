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
import { logout, logoutStart } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { postJson, getJson } from "../utils/api";
import CustomDropdown from "./CustomDropdown";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useSelector(
        (state) => state.auth
    );
    const cartState = useSelector((state) => state.cart);
    const { totalItems, loading: cartLoading } = cartState;

    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getJson("/api/products/categories");
                setCategories(
                    Array.isArray(data?.categories) ? data.categories : []
                );
            } catch (e) {
                setCategories([]);
            }
        };
        loadCategories();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory) params.append("category", selectedCategory);

        const queryString = params.toString();
        const url = queryString ? `/products?${queryString}` : "/products";
        navigate(url);
    };

    const handleLogout = async () => {
        try {
            // loading state for logout
            dispatch(logoutStart());

            await postJson("/api/auth/logout", {});
        } catch (e) {
        } finally {
            // add a little delay
            setTimeout(() => {
                dispatch(logout());
            }, 300);
        }
    };

    return (
        <header>
            {/* HEADER up top */}
            <div id="top-header">
                <div className="container">
                    <ul className="header-links pull-left">
                        <li>
                            <span style={{ color: "white" }}>
                                <i className="fa fa-phone"></i> +84-123-456-789
                            </span>
                        </li>
                        <li>
                            <span style={{ color: "white" }}>
                                <i className="fa fa-envelope-o"></i>{" "}
                                support@group13.vn
                            </span>
                        </li>
                        <li>
                            <span style={{ color: "white" }}>
                                <i className="fa fa-map-marker"></i> 123 Nguyen Van Linh St., District 7, Ho Chi Minh City
                            </span>
                        </li>
                    </ul>
                    <ul className="header-links pull-right">
                        <li>
                            {isAuthenticated ? (
                                <Link to="/my-account">
                                    <i className="fa fa-user-o"></i> Account
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <i className="fa fa-user-o"></i> Login
                                </Link>
                            )}
                        </li>
                        {isAuthenticated && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    disabled={authLoading}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "white",
                                        opacity: authLoading ? 0.6 : 1,
                                        transition: "opacity 0.3s ease",
                                        cursor: authLoading
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                >
                                    {authLoading ? (
                                        <>
                                            <i className="fa fa-spinner fa-spin"></i>{" "}
                                            Logging out
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-sign-out"></i>{" "}
                                            Logout
                                        </>
                                    )}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {/* /HEADER up top */}

            {/* Main HEADER */}
            <div id="header">
                <div className="container">
                    <div className="row">
                        {/* LOGO */}
                        <div className="col-md-3">
                            <div className="header-logo">
                                <Link to="/" className="logo">
                                    <img
                                        src={require("../assets/img/logo.png")}
                                        alt="Logo"
                                        style={{ width: "90px", height: "90px" }}
                                    />
                                </Link>
                            </div>
                        </div>
                        {/* /LOGO */}

                        {/* Search bar */}
                        <div className="col-md-6">
                            <div
                                className="header-search"
                                style={{ width: "100%" }}
                            >
                                <form
                                    onSubmit={handleSearch}
                                    style={{
                                        display: "flex",
                                        height: "50px",
                                        width: "100%",
                                        maxWidth: "100%",
                                    }}
                                >
                                    <CustomDropdown
                                        options={categories}
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        placeholder="All categories"
                                        style={{ flex: "0 0 160px" }}
                                    />
                                    <input
                                        className="input"
                                        placeholder="Find products..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        style={{
                                            flex: 1,
                                            minWidth: "250px",
                                            height: "50px",
                                            border: "2px solid #e1e5e9",
                                            borderLeft: "none",
                                            borderRight: "none",
                                            borderRadius: 0,
                                            padding: "0 20px",
                                            fontSize: "15px",
                                            fontWeight: "400",
                                            outline: "none",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "#fff",
                                            color: "#333",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#ff6b35";
                                            e.target.style.backgroundColor =
                                                "#fff";
                                            e.target.style.boxShadow =
                                                "0 0 0 3px rgba(255, 107, 53, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                "#e1e5e9";
                                            e.target.style.backgroundColor =
                                                "#fff";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="search-btn"
                                        style={{
                                            height: "50px",
                                            padding: "0 24px",
                                            backgroundColor: "#ff6b35",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "0 8px 8px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor =
                                                "#e55a2b";
                                            e.target.style.transform =
                                                "translateY(-1px)";
                                            e.target.style.boxShadow =
                                                "0 4px 12px rgba(255, 107, 53, 0.3)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor =
                                                "#ff6b35";
                                            e.target.style.transform =
                                                "translateY(0)";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    >
                                        <i
                                            className="fa fa-search"
                                            style={{ fontSize: "14px" }}
                                        />
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div>
                        {/* /Search bar */}

                        {/* Account */}
                        <div className="col-md-3 clearfix">
                            <div className="header-ctn">
                                {/* Cart */}
                                <div className="dropdown">
                                    <Link
                                        to="/cart"
                                        className="dropdown-toggle"
                                    >
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>Cart</span>
                                        <div
                                            className="qty"
                                            style={{
                                                transition: "all 0.3s ease",
                                                minWidth: "20px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {cartLoading || authLoading ? (
                                                <i
                                                    className="fa fa-spinner fa-spin"
                                                    style={{ fontSize: "12px" }}
                                                ></i>
                                            ) : (
                                                totalItems
                                            )}
                                        </div>
                                    </Link>
                                </div>
                                {/* /Cart */}

                                {/* menu toggle */}
                                <div className="menu-toggle">
                                    <span>
                                        <i className="fa fa-bars"></i>
                                        <span>Menu</span>
                                    </span>
                                </div>
                                {/* /menu toggle */}
                            </div>
                        </div>
                        {/* /account */}
                    </div>
                    {/*  */}
                </div>
                {/* container */}
            </div>
            {/* /Main HEADER */}
        </header>
    );
};

export default Header;
