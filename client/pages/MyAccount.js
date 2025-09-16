/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getJson } from "../utils/api";

const MyAccount = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            fetchOrders();
        }
    }, [isAuthenticated, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await getJson("/api/orders/customer/orders");
            setOrders(response.data || []);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    const getRoleDisplayName = (role) => {
        switch (role) {
            case "customer":
                return "Customer";
            case "vendor":
                return "Vendor";
            case "shipper":
                return "Shipper";
            default:
                return role;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "customer":
                return "#ee4d2d";
            case "vendor":
                return "#00bfa5";
            case "shipper":
                return "#ff6b35";
            default:
                return "#ee4d2d";
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            {/* Header Section */}
            <div
                style={{
                    background:
                        "linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)",
                    padding: "40px 0",
                    color: "white",
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-2">
                            <div
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 40,
                                    fontWeight: "bold",
                                    border: "4px solid rgba(255,255,255,0.3)",
                                }}
                            >
                                {user.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <h1
                                style={{
                                    margin: 0,
                                    marginBottom: 8,
                                    fontSize: 28,
                                }}
                            >
                                {user.name || user.username}
                            </h1>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    marginBottom: 8,
                                }}
                            >
                                <span
                                    style={{
                                        background: "rgba(255,255,255,0.2)",
                                        padding: "4px 12px",
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    {getRoleDisplayName(user.role)}
                                </span>
                                <span style={{ opacity: 0.9, fontSize: 16 }}>
                                    @{user.username}
                                </span>
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    opacity: 0.8,
                                    fontSize: 14,
                                }}
                            >
                                Joined since{" "}
                                {user.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString("vi-VN")
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="col-md-2 text-right">
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.2)",
                                    padding: "8px 16px",
                                    borderRadius: 20,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="container"
                style={{ paddingTop: 24, paddingBottom: 40 }}
            >
                <div className="row">
                    {/* Left Sidebar */}
                    <div className="col-md-3">
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 20,
                                marginBottom: 20,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h5
                                style={{
                                    margin: "0 0 16px 0",
                                    color: "#333",
                                    fontSize: 16,
                                }}
                            >
                                My account
                            </h5>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <Link
                                    to="/account"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        background: "#ee4d2d",
                                        color: "white",
                                        textDecoration: "none",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                >
                                    <i
                                        className="fa fa-user"
                                        style={{ marginRight: 8, width: 16 }}
                                    ></i>
                                    Personal information
                                </Link>
                                <Link
                                    to="/orders"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        color: "#666",
                                        textDecoration: "none",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#f5f5f5";
                                        e.target.style.color = "#ee4d2d";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background =
                                            "transparent";
                                        e.target.style.color = "#666";
                                    }}
                                >
                                    <i
                                        className="fa fa-shopping-bag"
                                        style={{ marginRight: 8, width: 16 }}
                                    ></i>
                                    My orders
                                </Link>
                                <Link
                                    to="/cart"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        color: "#666",
                                        textDecoration: "none",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#f5f5f5";
                                        e.target.style.color = "#ee4d2d";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background =
                                            "transparent";
                                        e.target.style.color = "#666";
                                    }}
                                >
                                    <i
                                        className="fa fa-shopping-cart"
                                        style={{ marginRight: 8, width: 16 }}
                                    ></i>
                                    Cart
                                </Link>
                                {user.role === "vendor" && (
                                    <Link
                                        to="/vendor/products"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "12px 16px",
                                            color: "#666",
                                            textDecoration: "none",
                                            borderRadius: 6,
                                            fontSize: 14,
                                            transition: "all 0.2s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background =
                                                "#f5f5f5";
                                            e.target.style.color = "#ee4d2d";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background =
                                                "transparent";
                                            e.target.style.color = "#666";
                                        }}
                                    >
                                        <i
                                            className="fa fa-box"
                                            style={{
                                                marginRight: 8,
                                                width: 16,
                                            }}
                                        ></i>
                                        My products
                                    </Link>
                                )}
                                {user.role === "vendor" && (
                                    <Link
                                        to="/vendor/profile"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "12px 16px",
                                            color: "#666",
                                            textDecoration: "none",
                                            borderRadius: 6,
                                            fontSize: 14,
                                            transition: "all 0.2s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background =
                                                "#f5f5f5";
                                            e.target.style.color = "#ee4d2d";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background =
                                                "transparent";
                                            e.target.style.color = "#666";
                                        }}
                                    >
                                        <i
                                            className="fa fa-user-edit"
                                            style={{
                                                marginRight: 8,
                                                width: 16,
                                            }}
                                        ></i>
                                        Update information
                                    </Link>
                                )}
                                {user.role === "shipper" && (
                                    <Link
                                        to="/shipper/orders"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "12px 16px",
                                            color: "#666",
                                            textDecoration: "none",
                                            borderRadius: 6,
                                            fontSize: 14,
                                            transition: "all 0.2s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background =
                                                "#f5f5f5";
                                            e.target.style.color = "#ee4d2d";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background =
                                                "transparent";
                                            e.target.style.color = "#666";
                                        }}
                                    >
                                        <i
                                            className="fa fa-truck"
                                            style={{
                                                marginRight: 8,
                                                width: 16,
                                            }}
                                        ></i>
                                        Orders being shipped
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 20,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h5
                                style={{
                                    margin: "0 0 16px 0",
                                    color: "#333",
                                    fontSize: 16,
                                }}
                            >
                                About this account
                            </h5>
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
                                            background: "#d4edda",
                                            color: "#155724",
                                            padding: "4px 8px",
                                            borderRadius: 4,
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Active
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
                                        Account type
                                    </span>
                                    <span
                                        style={{
                                            color: getRoleColor(user.role),
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        {getRoleDisplayName(user.role)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        {/* Personal Information */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 24,
                                marginBottom: 20,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 24,
                                }}
                            >
                                <div
                                    style={{
                                        width: 4,
                                        height: 24,
                                        background: "#ee4d2d",
                                        borderRadius: 2,
                                        marginRight: 12,
                                    }}
                                ></div>
                                <h4
                                    style={{
                                        margin: 0,
                                        color: "#333",
                                        fontSize: 18,
                                    }}
                                >
                                    Personal information
                                </h4>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div style={{ marginBottom: 20 }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 600,
                                                color: "#333",
                                                fontSize: 14,
                                                marginBottom: 8,
                                            }}
                                        >
                                            Username
                                        </label>
                                        <div
                                            style={{
                                                padding: "12px 16px",
                                                background: "#f8f9fa",
                                                borderRadius: 6,
                                                border: "1px solid #e9ecef",
                                                color: "#333",
                                                fontSize: 14,
                                            }}
                                        >
                                            {user.username}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ marginBottom: 20 }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 600,
                                                color: "#333",
                                                fontSize: 14,
                                                marginBottom: 8,
                                            }}
                                        >
                                            Full name
                                        </label>
                                        <div
                                            style={{
                                                padding: "12px 16px",
                                                background: "#f8f9fa",
                                                borderRadius: 6,
                                                border: "1px solid #e9ecef",
                                                color: "#333",
                                                fontSize: 14,
                                            }}
                                        >
                                            {user.name || "Chưa cung cấp"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {user.address && (
                                <div style={{ marginBottom: 20 }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            color: "#333",
                                            fontSize: 14,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Address
                                    </label>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            background: "#f8f9fa",
                                            borderRadius: 6,
                                            border: "1px solid #e9ecef",
                                            color: "#333",
                                            fontSize: 14,
                                        }}
                                    >
                                        {user.address}
                                    </div>
                                </div>
                            )}

                            {user.businessName && (
                                <div style={{ marginBottom: 20 }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            color: "#333",
                                            fontSize: 14,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Business name
                                    </label>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            background: "#f8f9fa",
                                            borderRadius: 6,
                                            border: "1px solid #e9ecef",
                                            color: "#333",
                                            fontSize: 14,
                                        }}
                                    >
                                        {user.businessName}
                                    </div>
                                </div>
                            )}

                            {user.businessAddress && (
                                <div style={{ marginBottom: 20 }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            color: "#333",
                                            fontSize: 14,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Business address
                                    </label>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            background: "#f8f9fa",
                                            borderRadius: 6,
                                            border: "1px solid #e9ecef",
                                            color: "#333",
                                            fontSize: 14,
                                        }}
                                    >
                                        {user.businessAddress}
                                    </div>
                                </div>
                            )}

                            {user.distributionHub && (
                                <div style={{ marginBottom: 20 }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            color: "#333",
                                            fontSize: 14,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Distribution hub
                                    </label>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            background: "#f8f9fa",
                                            borderRadius: 6,
                                            border: "1px solid #e9ecef",
                                            color: "#333",
                                            fontSize: 14,
                                        }}
                                    >
                                        {user.distributionHub}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Orders List */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 24,
                                marginBottom: 20,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 24,
                                }}
                            >
                                <div
                                    style={{
                                        width: 4,
                                        height: 24,
                                        background: "#ee4d2d",
                                        borderRadius: 2,
                                        marginRight: 12,
                                    }}
                                ></div>
                                <h4
                                    style={{
                                        margin: 0,
                                        color: "#333",
                                        fontSize: 18,
                                    }}
                                >
                                    My orders
                                </h4>
                            </div>

                            {loading ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 0",
                                    }}
                                >
                                    <i
                                        className="fa fa-spinner fa-spin"
                                        style={{
                                            fontSize: 24,
                                            color: "#ee4d2d",
                                        }}
                                    ></i>
                                    <p style={{ marginTop: 16, color: "#666" }}>
                                        Loading orders...
                                    </p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 0",
                                    }}
                                >
                                    <i
                                        className="fa fa-shopping-bag"
                                        style={{
                                            fontSize: 48,
                                            color: "#ddd",
                                            marginBottom: 16,
                                        }}
                                    ></i>
                                    <p style={{ color: "#666", fontSize: 16 }}>
                                        You have no orders yet...
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
                                            marginTop: 16,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Shop now
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 16,
                                    }}
                                >
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            style={{
                                                border: "1px solid #e9ecef",
                                                borderRadius: 8,
                                                padding: 16,
                                                background: "#f8f9fa",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <div>
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            color: "#333",
                                                        }}
                                                    >
                                                        Order #
                                                        {order.id.slice(-8)}
                                                    </span>
                                                    <span
                                                        style={{
                                                            marginLeft: 12,
                                                            padding: "4px 8px",
                                                            borderRadius: 4,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            background:
                                                                order.status ===
                                                                "pending"
                                                                    ? "#fff3cd"
                                                                    : order.status ===
                                                                      "active"
                                                                    ? "#d4edda"
                                                                    : "#f8d7da",
                                                            color:
                                                                order.status ===
                                                                "pending"
                                                                    ? "#856404"
                                                                    : order.status ===
                                                                      "active"
                                                                    ? "#155724"
                                                                    : "#721c24",
                                                        }}
                                                    >
                                                        {order.status ===
                                                        "pending"
                                                            ? "Chờ xử lý"
                                                            : order.status ===
                                                              "active"
                                                            ? "Đang giao"
                                                            : "Hoàn thành"}
                                                    </span>
                                                </div>
                                                <span
                                                    style={{
                                                        color: "#666",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </span>
                                            </div>
                                            <div style={{ marginBottom: 8 }}>
                                                <span
                                                    style={{
                                                        color: "#666",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Product:{" "}
                                                </span>
                                                <span
                                                    style={{
                                                        color: "#333",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {order.products
                                                        .map(
                                                            (p) =>
                                                                p.productId
                                                                    ?.name ||
                                                                "N/A"
                                                        )
                                                        .join(", ")}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#666",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Total:{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            color: "#ee4d2d",
                                                        }}
                                                    >
                                                        {order.totalAmount.toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        ₫
                                                    </span>
                                                </span>
                                                <span
                                                    style={{
                                                        color: "#666",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Address:{" "}
                                                    {order.customerAddress}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: 8,
                                padding: 24,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 24,
                                }}
                            >
                                <div
                                    style={{
                                        width: 4,
                                        height: 24,
                                        background: "#ee4d2d",
                                        borderRadius: 2,
                                        marginRight: 12,
                                    }}
                                ></div>
                                <h4
                                    style={{
                                        margin: 0,
                                        color: "#333",
                                        fontSize: 18,
                                    }}
                                >
                                    Quick actions
                                </h4>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <Link
                                        to="/products"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            padding: "24px 16px",
                                            background:
                                                "linear-gradient(135deg, #ee4d2d 0%, #ff6b35 100%)",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: 8,
                                            transition: "all 0.3s",
                                            textAlign: "center",
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
                                        <i
                                            className="fa fa-shopping-bag"
                                            style={{
                                                fontSize: 24,
                                                marginBottom: 8,
                                            }}
                                        ></i>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 14,
                                            }}
                                        >
                                            Browse Products
                                        </span>
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <Link
                                        to="/cart"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            padding: "24px 16px",
                                            background:
                                                "linear-gradient(135deg, #00bfa5 0%, #00acc1 100%)",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: 8,
                                            transition: "all 0.3s",
                                            textAlign: "center",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform =
                                                "translateY(-2px)";
                                            e.target.style.boxShadow =
                                                "0 8px 25px rgba(0, 191, 165, 0.3)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform =
                                                "translateY(0)";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    >
                                        <i
                                            className="fa fa-shopping-cart"
                                            style={{
                                                fontSize: 24,
                                                marginBottom: 8,
                                            }}
                                        ></i>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 14,
                                            }}
                                        >
                                            See cart
                                        </span>
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <Link
                                        to="/my-account"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            padding: "24px 16px",
                                            background:
                                                "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: 8,
                                            transition: "all 0.3s",
                                            textAlign: "center",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform =
                                                "translateY(-2px)";
                                            e.target.style.boxShadow =
                                                "0 8px 25px rgba(156, 39, 176, 0.3)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform =
                                                "translateY(0)";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    >
                                        <i
                                            className="fa fa-file-text-o"
                                            style={{
                                                fontSize: 24,
                                                marginBottom: 8,
                                            }}
                                        ></i>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 14,
                                            }}
                                        >
                                            My orders
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
