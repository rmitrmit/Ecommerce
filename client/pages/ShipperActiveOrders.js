/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import {
    fetchActiveOrdersStart,
    fetchActiveOrdersSuccess,
    fetchActiveOrdersFailure,
} from "../store/slices/ordersSlice";
import { getJson, API_BASE } from "../utils/api";


const ShipperActiveOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { activeOrders, loading } = useSelector((state) => state.orders);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    useEffect(() => {
        const fetchShipperOrders = async () => {
            dispatch(fetchActiveOrdersStart());
            try {
                const data = await getJson("/api/orders/shipper/orders");

                const orders = (data.orders || []).map((order) => {
                    return {
                        id: order._id,
                        customerId: order.customerId?._id,
                        customerName:
                            order.customerId?.name ||
                            order.customerId?.username ||
                            "Unknown Customer",
                        customerAddress:
                            order.customerId?.address || "Unknown Address",
                        items: (order.products || [])
                            .filter((item) => item && item.productId)
                            .map((item) => ({
                                product: {
                                    id: item.productId._id,
                                    name:
                                        item.productId.name ||
                                        "Unknown Product",
                                    price: item.productId.price || 0,
                                    image: (() => {
                                        const firstImage =
                                            item.productId.images &&
                                            item.productId.images.length > 0
                                                ? item.productId.images[0]
                                                : null;
                                        const basePath = firstImage
                                            ? `${API_BASE}/${firstImage}`
                                            : `${API_BASE}/uploads/products/product01.png`;
                                        return `${basePath}?t=${Date.now()}`;
                                    })(),
                                },
                                quantity: item.quantity || 1,
                            })),
                        totalAmount: order.totalAmount || 0,
                        status: order.status || "active",
                        shipperId: user?.id,
                        shipperName: user?.username,
                        distributionHub:
                            order.assignedHub?.name || "Unknown Hub",
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt,
                    };
                });

                dispatch(fetchActiveOrdersSuccess(orders));
            } catch (err) {
                dispatch(
                    fetchActiveOrdersFailure(err.message || "Error")
                );
            }
        };

        fetchShipperOrders();
    }, [dispatch, user?.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "#ff9500";
            case "confirmed":
                return "#1890ff";
            case "shipped":
                return "#52c41a";
            case "delivered":
                return "#00a651";
            case "cancelled":
                return "#ff4d4f";
            default:
                return "#666";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Pending confirmation";
            case "confirmed":
                return "Confirmed";
            case "shipped":
                return "Shipping";
            case "delivered":
                return "Delivered";
            case "cancelled":
                return "Cancelled";
            default:
                return status;
        }
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

    if (loading) {
        return (
            <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <div style={{ backgroundColor: "#ee4d2d", padding: "16px 0" }}>
                    <div className="container">
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
                </div>
                <div className="container" style={{ paddingTop: "24px" }}>
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{ fontSize: "18px", color: "#666" }}>
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#ee4d2d", padding: "16px 0" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <Link
                                    to="/shipper/dashboard"
                                    style={{
                                        color: "white",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        border: "1px solid rgba(255,255,255,0.3)",
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
                                    ← Dashboard
                                </Link>
                                <h2
                                    style={{
                                        color: "white",
                                        margin: 0,
                                        fontSize: "24px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Manage orders
                                </h2>
                            </div>
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
                {/* Stats Cards */}
                <div className="row" style={{ marginBottom: "24px" }}>
                    <div className="col-md-3">
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
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#ff9500",
                                    marginBottom: "8px",
                                }}
                            >
                                {
                                    activeOrders.filter(
                                        (order) => order.status === "pending"
                                    ).length
                                }
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                            Pending confirmation
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
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
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#1890ff",
                                    marginBottom: "8px",
                                }}
                            >
                                {
                                    activeOrders.filter(
                                        (order) => order.status === "confirmed"
                                    ).length
                                }
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                                Confirmed
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
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
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#52c41a",
                                    marginBottom: "8px",
                                }}
                            >
                                {
                                    activeOrders.filter(
                                        (order) => order.status === "shipped"
                                    ).length
                                }
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                                Shipping
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
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
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#00a651",
                                    marginBottom: "8px",
                                }}
                            >
                                {
                                    activeOrders.filter(
                                        (order) => order.status === "delivered"
                                    ).length
                                }
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                                Delivered
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
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
                            {/* Header */}
                            <div
                                style={{
                                    backgroundColor: "#fafafa",
                                    padding: "16px 24px",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Order list
                                </h4>
                                <p
                                    style={{
                                        margin: "4px 0 0 0",
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    Total {activeOrders.length} orders
                                </p>
                            </div>

                            {/* Orders */}
                            <div style={{ padding: "0" }}>
                                {activeOrders.length === 0 ? (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "40px",
                                            color: "#666",
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
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            No orders yet
                                        </div>
                                        <div style={{ fontSize: "14px" }}>
                                            Orders will be displayed here
                                        </div>
                                    </div>
                                ) : (
                                    activeOrders.map((order) => (
                                        <div
                                            key={order.id}
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
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Order ID
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        #{order.id.slice(-8)}
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Customer
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {order.customerName}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        {order.customerAddress}
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Product quantity
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {order.items.length} products
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Total
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            color: "#ee4d2d",
                                                        }}
                                                    >
                                                        {order.totalAmount.toLocaleString()}
                                                        ₫
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        Status
                                                    </div>
                                                    <span
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            color: "white",
                                                            backgroundColor:
                                                                getStatusColor(
                                                                    order.status
                                                                ),
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                        }}
                                                    >
                                                        {getStatusText(
                                                            order.status
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-md-1">
                                                    <Link
                                                        to={`/shipper/orders/${order.id}`}
                                                        style={{
                                                            backgroundColor:
                                                                "#ee4d2d",
                                                            color: "white",
                                                            padding: "8px 16px",
                                                            borderRadius: "4px",
                                                            textDecoration:
                                                                "none",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            display:
                                                                "inline-block",
                                                            transition:
                                                                "background-color 0.3s",
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
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div
                                                style={{
                                                    marginTop: "12px",
                                                    paddingTop: "12px",
                                                    borderTop:
                                                        "1px solid #f0f0f0",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    Product:
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {order.items
                                                        .slice(0, 3)
                                                        .map((item, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "#f8f9fa",
                                                                    padding:
                                                                        "4px 8px",
                                                                    borderRadius:
                                                                        "4px",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        item
                                                                            .product
                                                                            .image
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            "2px",
                                                                        marginRight:
                                                                            "6px",
                                                                    }}
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.target.src = `${API_BASE}/uploads/products/product01.png?t=${Date.now()}`;
                                                                    }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        color: "#333",
                                                                    }}
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }{" "}
                                                                    (x
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>
                                                        ))}
                                                    {order.items.length > 3 && (
                                                        <div
                                                            style={{
                                                                backgroundColor:
                                                                    "#e9ecef",
                                                                padding:
                                                                    "4px 8px",
                                                                borderRadius:
                                                                    "4px",
                                                                fontSize:
                                                                    "12px",
                                                                color: "#666",
                                                            }}
                                                        >
                                                            +
                                                            {order.items
                                                                .length -
                                                                3}{" "}
                                                            Other products
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Date */}
                                            <div
                                                style={{
                                                    marginTop: "8px",
                                                    fontSize: "12px",
                                                    color: "#999",
                                                }}
                                            >
                                                Created:{" "}
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperActiveOrders;
