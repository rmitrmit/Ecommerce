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

const ShipperDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#ee4d2d", padding: "16px 0" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h2
                                style={{
                                    color: "white",
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "600",
                                }}
                            >
                                Shipper Center
                            </h2>
                        </div>
                        <div className="col-md-6 text-right">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: "16px",
                                }}
                            >
                                <span
                                    style={{ color: "white", fontSize: "14px" }}
                                >
                                    Welcome, {user?.username}
                                </span>
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
            </div>

            <div
                className="container"
                style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
                {/* Main Action */}
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
                                    marginBottom: "16px",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                }}
                            >
                                Manage orders
                            </h4>
                            <p style={{ color: "#666", marginBottom: "20px" }}>
                                Manage orders from your distribution hub
                            </p>
                            <Link
                                to="/shipper/orders"
                                style={{
                                    backgroundColor: "#ee4d2d",
                                    color: "white",
                                    padding: "12px 24px",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    display: "inline-block",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#d73502";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "#ee4d2d";
                                }}
                            >
                                📦 See orders
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Shipper Info */}
                <div className="row">
                    <div className="col-md-12">
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h4
                                style={{
                                    marginBottom: "16px",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                }}
                            >
                                Shipper Information
                            </h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <div style={{ marginBottom: "12px" }}>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#666",
                                                display: "inline-block",
                                                width: "120px",
                                            }}
                                        >
                                            Name:
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {user?.username}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#666",
                                                display: "inline-block",
                                                width: "120px",
                                            }}
                                        >
                                            Email:
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ marginBottom: "12px" }}>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#666",
                                                display: "inline-block",
                                                width: "120px",
                                            }}
                                        >
                                            Address:
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {user?.address || "Not yet updated"}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#666",
                                                display: "inline-block",
                                                width: "120px",
                                            }}
                                        >
                                            Status:
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: user?.isActive
                                                    ? "#00a651"
                                                    : "#ff4d4f",
                                                backgroundColor: user?.isActive
                                                    ? "#f6ffed"
                                                    : "#fff2f0",
                                                padding: "2px 8px",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            {user?.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ShipperDashboard;
