/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const VendorLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Vendor Header */}
            <header
                style={{
                    backgroundColor: "#ee4d2d",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <div className="container">
                    <div
                        className="row align-items-center"
                        style={{ padding: "12px 0" }}
                    >
                        {/* Logo/Brand */}
                        <div className="col-md-3">
                            <Link
                                to="/vendor/dashboard"
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            backgroundColor: "white",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "20px",
                                                fontWeight: "bold",
                                                color: "#ee4d2d",
                                            }}
                                        >
                                            S
                                        </span>
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                color: "white",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                lineHeight: "1.2",
                                            }}
                                        >
                                            Electro
                                        </div>
                                        <div
                                            style={{
                                                color: "rgba(255,255,255,0.8)",
                                                fontSize: "12px",
                                            }}
                                        >
                                            Seller Center
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Menu */}
                        <div className="col-md-6">
                            <nav
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "32px",
                                }}
                            >
                                <Link
                                    to="/vendor/dashboard"
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "rgba(255,255,255,0.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/vendor/my-products"
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "rgba(255,255,255,0.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    Product
                                </Link>
                                <Link
                                    to="/vendor/add-product"
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "rgba(255,255,255,0.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    Add product
                                </Link>
                                <Link
                                    to="/vendor/profile"
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "rgba(255,255,255,0.1)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    Setting
                                </Link>
                            </nav>
                        </div>

                        {/* User Info & Actions */}
                        <div className="col-md-3">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: "16px",
                                }}
                            >
                                {/* User Info */}
                                <div style={{ textAlign: "right" }}>
                                    <div
                                        style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {user?.businessName || user?.username}
                                    </div>
                                    <div
                                        style={{
                                            color: "rgba(255,255,255,0.8)",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Vendor
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "rgba(255,255,255,0.1)";
                                        e.target.style.borderColor =
                                            "rgba(255,255,255,0.5)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                        e.target.style.borderColor =
                                            "rgba(255,255,255,0.3)";
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
                {children}
            </main>

            {/* Vendor Footer */}
            <footer
                style={{
                    backgroundColor: "#2c2c2c",
                    color: "white",
                    padding: "24px 0",
                    marginTop: "auto",
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h6
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    marginBottom: "12px",
                                }}
                            >
                                Online Electronics Seller Center
                            </h6>
                        </div>
                        <div className="col-md-2">
                            <h6
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginBottom: "12px",
                                }}
                            >
                                Support
                            </h6>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Support center
                                    </a>
                                </li>
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Contact support
                                    </a>
                                </li>
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Instructions
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <h6
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginBottom: "12px",
                                }}
                            >
                                Policy
                            </h6>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Terms
                                    </a>
                                </li>
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Privacy
                                    </a>
                                </li>
                                <li style={{ marginBottom: "8px" }}>
                                    <a
                                        href="#"
                                        style={{
                                            color: "#ccc",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Rules
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginBottom: "12px",
                                }}
                            >
                                Contact
                            </h6>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#ccc",
                                    lineHeight: "1.5",
                                }}
                            >
                                <div style={{ marginBottom: "4px" }}>
                                    📧 Email: seller-support@group13.vn
                                </div>
                                <div style={{ marginBottom: "4px" }}>
                                    📞 Hotline: +84-123-456-789
                                </div>
                                <div>🕒 Time: 8:00 - 22:00 (Mon-Sun)</div>
                            </div>
                        </div>
                    </div>
                    <hr
                        style={{ borderColor: "#444", margin: "24px 0 16px 0" }}
                    />
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "#999",
                                    margin: 0,
                                }}
                            >
                                © 2025 Online Electronics Seller Center. Rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-right">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "16px",
                                }}
                            >
                                <a
                                    href="#"
                                    style={{
                                        color: "#999",
                                        textDecoration: "none",
                                        fontSize: "12px",
                                    }}
                                >
                                    Facebook
                                </a>
                                <a
                                    href="#"
                                    style={{
                                        color: "#999",
                                        textDecoration: "none",
                                        fontSize: "12px",
                                    }}
                                >
                                    Instagram
                                </a>
                                <a
                                    href="#"
                                    style={{
                                        color: "#999",
                                        textDecoration: "none",
                                        fontSize: "12px",
                                    }}
                                >
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default VendorLayout;
