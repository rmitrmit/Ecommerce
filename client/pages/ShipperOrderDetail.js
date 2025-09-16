/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    updateOrderStatusStart,
    updateOrderStatusSuccess,
    updateOrderStatusFailure,
} from "../store/slices/ordersSlice";
import { putJson } from "../utils/api";
import { API_BASE } from "../utils/api";

const ShipperOrderDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { activeOrders, loading, error } = useSelector(
        (state) => state.orders
    );

    const order = activeOrders.find((o) => o.id === id);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleStatusUpdate = async (newStatus) => {
        dispatch(updateOrderStatusStart());

        try {
            await putJson(`/api/orders/${id}/status`, { status: newStatus });
            dispatch(
                updateOrderStatusSuccess({ orderId: id, status: newStatus })
            );

            const message =
                newStatus === "delivered"
                ? "Order marked as successfully delivered!"
                : "Order cancelled successfully!";
            setSuccessMessage(message);
            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate("/shipper/orders");
            }, 3000);
        } catch (err) {
            dispatch(
                updateOrderStatusFailure(
                    err.message ||
                        "Error"
                )
            );
        }
    };

    const handleActionClick = (action) => {
        setPendingAction(action);
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = () => {
        if (pendingAction) {
            handleStatusUpdate(pendingAction);
        }
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    const handleCancelAction = () => {
        setShowConfirmDialog(false);
        setPendingAction(null);
    };

    if (!order) {
        return (
            <div>
                <div className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h3>Cannot find order</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusTimeline = () => {
        const timeline = [
            {
                status: "pending",
                title: "Order placed",
                description: "The order has been created and is pending processing",
                completed: true,
                active: false,
            },
            {
                status: "active",
                title: "Shipping",
                description: "The order is being delivered to you",
                completed:
                    order.status === "delivered" || order.status === "canceled",
                active: order.status === "active",
            },
            {
                status: "delivered",
                title: "Delivered",
                description: "The order has been successfully delivered",
                completed: order.status === "delivered",
                active: false,
            },
        ];
        
        if (order.status === "canceled") {
            timeline[1] = {
                status: "canceled",
                title: "Order cancelled",
                description: "The order has been cancelled",
                completed: true,
                active: false,
            };
        }        

        return timeline;
    };

    return (
        <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes slideInRight {
                        0% { 
                            transform: translateX(100%); 
                            opacity: 0; 
                        }
                        100% { 
                            transform: translateX(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @keyframes fadeIn {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
            {showSuccessMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#52c41a",
                        color: "white",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        animation: "slideInRight 0.3s ease-out",
                        maxWidth: "400px",
                    }}
                >
                    <span style={{ fontSize: "20px" }}>✓</span>
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                marginBottom: "8px",
                            }}
                        >
                            {successMessage}
                        </div>
                        <button
                            onClick={() => {
                                setShowSuccessMessage(false);
                                navigate("/shipper/orders");
                            }}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.2)",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                                padding: "4px 12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor =
                                    "rgba(255,255,255,0.3)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor =
                                    "rgba(255,255,255,0.2)";
                            }}
                        >
                            Return
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <span style={{ fontSize: "20px" }}>✕</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        {error}
                    </span>
                </div>
            )}

            {showConfirmDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1001,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "32px",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                            maxWidth: "400px",
                            width: "90%",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                color:
                                    pendingAction === "delivered"
                                        ? "#52c41a"
                                        : "#ff4d4f",
                            }}
                        >
                            {pendingAction === "delivered" ? "✓" : "⚠"}
                        </div>
                        <h3
                            style={{
                                margin: "0 0 16px 0",
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            {pendingAction === "delivered"
                                ? "Confirm as delivered"
                                : "Confirm order cancellation"}
                        </h3>
                        <p
                            style={{
                                margin: "0 0 24px 0",
                                fontSize: "14px",
                                color: "#666",
                                lineHeight: "1.5",
                            }}
                        >
                            {pendingAction === "delivered"
                                ? "Are you sure you want to mark this order as successfully delivered?"
                                : "Are you sure you want to cancel this order? This action cannot be undone."}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={handleCancelAction}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#666",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    border: "1px solid #d9d9d9",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#f5f5f5";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor =
                                        "transparent";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={loading}
                                style={{
                                    backgroundColor:
                                        pendingAction === "delivered"
                                            ? "#52c41a"
                                            : "#ff4d4f",
                                    color: "white",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                    opacity: loading ? 0.6 : 1,
                                }}
                                onMouseOver={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor =
                                            pendingAction === "delivered"
                                                ? "#389e0d"
                                                : "#d9363e";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor =
                                            pendingAction === "delivered"
                                                ? "#52c41a"
                                                : "#ff4d4f";
                                    }
                                }}
                            >
                                {loading ? "Loading..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="section" style={{ paddingTop: "20px" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "24px",
                                    backgroundColor: "white",
                                    padding: "16px 20px",
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <button
                                    onClick={() => navigate("/shipper/orders")}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "1px solid #d9d9d9",
                                        color: "#666",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        marginRight: "16px",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor =
                                            "#f5f5f5";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    ← Return
                                </button>
                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "24px",
                                            fontWeight: "600",
                                            color: "#333",
                                        }}
                                    >
                                        Order detail #{order.id.slice(-8)}
                                    </h2>
                                    <p
                                        style={{
                                            margin: "4px 0 0 0",
                                            color: "#666",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Ordered at{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "24px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 20px 0",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    Status
                                </h3>
                                <div style={{ position: "relative" }}>
                                    {getStatusTimeline().map((step, index) => (
                                        <div
                                            key={step.status}
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                marginBottom:
                                                    index <
                                                    getStatusTimeline().length -
                                                        1
                                                        ? "24px"
                                                        : "0",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        step.completed
                                                            ? "#ee4d2d"
                                                            : step.active
                                                            ? "#ee4d2d"
                                                            : "#d9d9d9",
                                                    border: "3px solid white",
                                                    boxShadow:
                                                        "0 0 0 2px " +
                                                        (step.completed
                                                            ? "#ee4d2d"
                                                            : step.active
                                                            ? "#ee4d2d"
                                                            : "#d9d9d9"),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "16px",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {step.completed && (
                                                    <span
                                                        style={{
                                                            color: "white",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4
                                                    style={{
                                                        margin: "0 0 4px 0",
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color:
                                                            step.completed ||
                                                            step.active
                                                                ? "#333"
                                                                : "#999",
                                                    }}
                                                >
                                                    {step.title}
                                                </h4>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "14px",
                                                        color:
                                                            step.completed ||
                                                            step.active
                                                                ? "#666"
                                                                : "#999",
                                                    }}
                                                >
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "24px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 20px 0",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    Shipping information
                                </h3>
                                <div style={{ display: "flex", gap: "24px" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: "16px" }}>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "14px",
                                                    color: "#666",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Name
                                            </label>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    color: "#333",
                                                }}
                                            >
                                                {order.customerName}
                                            </p>
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "14px",
                                                    color: "#666",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Address
                                            </label>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "16px",
                                                    color: "#333",
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                {order.customerAddress}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: "16px" }}>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "14px",
                                                    color: "#666",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                TDistribution hub
                                            </label>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    color: "#333",
                                                }}
                                            >
                                                {order.distributionHub}
                                            </p>
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "14px",
                                                    color: "#666",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Status
                                            </label>
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        order.status ===
                                                        "active"
                                                            ? "#52c41a"
                                                            : order.status ===
                                                              "delivered"
                                                            ? "#1890ff"
                                                            : "#ff4d4f",
                                                    color: "white",
                                                    padding: "4px 12px",
                                                    borderRadius: "12px",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {order.status === "active"
                                                    ? "Shipping"
                                                    : order.status ===
                                                      "Delivered"
                                                    ? "Delivered"
                                                    : "Canceled"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "24px",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 20px 0",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    Products ordered
                                </h3>
                                <div
                                    style={{
                                        border: "1px solid #f0f0f0",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "20px",
                                                borderBottom:
                                                    index <
                                                    order.items.length - 1
                                                        ? "1px solid #f0f0f0"
                                                        : "none",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "8px",
                                                    overflow: "hidden",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = `${API_BASE}/uploads/products/product01.png?t=${Date.now()}`;
                                                    }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4
                                                    style={{
                                                        margin: "0 0 8px 0",
                                                        fontSize: "16px",
                                                        fontWeight: "500",
                                                        color: "#333",
                                                        lineHeight: "1.4",
                                                    }}
                                                >
                                                    {item.product.name}
                                                </h4>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "16px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        {item.product.price.toLocaleString()}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div
                                                    style={{
                                                        fontSize: "18px",
                                                        fontWeight: "600",
                                                        color: "#ee4d2d",
                                                    }}
                                                >
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                    ₫
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        marginTop: "20px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            color: "#333",
                                        }}
                                    >
                                        Total:
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            color: "#ee4d2d",
                                        }}
                                    >
                                        {order.totalAmount.toLocaleString()}₫
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "24px",
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    position: "sticky",
                                    top: "20px",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 20px 0",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#333",
                                    }}
                                >
                                    Action
                                </h3>

                                {order.status === "active" && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleActionClick("delivered")
                                            }
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                backgroundColor: "#ee4d2d",
                                                color: "white",
                                                padding: "14px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                                boxShadow:
                                                    "0 2px 4px rgba(238, 77, 45, 0.3)",
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                            onMouseOver={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor =
                                                        "#d73527";
                                                    e.target.style.transform =
                                                        "translateY(-1px)";
                                                    e.target.style.boxShadow =
                                                        "0 4px 8px rgba(238, 77, 45, 0.4)";
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor =
                                                        "#ee4d2d";
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                    e.target.style.boxShadow =
                                                        "0 2px 4px rgba(238, 77, 45, 0.3)";
                                                }
                                            }}
                                        >
                                            {loading &&
                                            pendingAction === "delivered" ? (
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            border: "2px solid transparent",
                                                            borderTop:
                                                                "2px solid white",
                                                            borderRadius: "50%",
                                                            animation:
                                                                "spin 1s linear infinite",
                                                        }}
                                                    ></span>
                                                    Loading...
                                                </span>
                                            ) : (
                                                "✓ Mark as delivered"
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleActionClick("canceled")
                                            }
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                backgroundColor: "transparent",
                                                color: "#ff4d4f",
                                                padding: "14px 20px",
                                                borderRadius: "8px",
                                                border: "2px solid #ff4d4f",
                                                cursor: loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                            onMouseOver={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor =
                                                        "#ff4d4f";
                                                    e.target.style.color =
                                                        "white";
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!loading) {
                                                    e.target.style.backgroundColor =
                                                        "transparent";
                                                    e.target.style.color =
                                                        "#ff4d4f";
                                                }
                                            }}
                                        >
                                            {loading &&
                                            pendingAction === "canceled" ? (
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: "16px",
                                                            height: "16px",
                                                            border: "2px solid transparent",
                                                            borderTop:
                                                                "2px solid #ff4d4f",
                                                            borderRadius: "50%",
                                                            animation:
                                                                "spin 1s linear infinite",
                                                        }}
                                                    ></span>
                                                    Loading...
                                                </span>
                                            ) : (
                                                "✕ Cancel"
                                            )}
                                        </button>
                                    </div>
                                )}

                                {order.status !== "active" && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "40px 20px",
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "8px",
                                            border: "1px solid #e9ecef",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "48px",
                                                marginBottom: "16px",
                                                opacity: 0.5,
                                            }}
                                        >
                                            {order.status === "delivered"
                                                ? "✓"
                                                : "✕"}
                                        </div>
                                        <h4
                                            style={{
                                                margin: "0 0 8px 0",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "#333",
                                            }}
                                        >
                                            {order.status === "delivered"
                                                ? "Delivered"
                                                : "Canceled"}
                                        </h4>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "14px",
                                                color: "#666",
                                            }}
                                        >
                                            {order.status === "delivered"
                                                ? "Delivered"
                                                : "Canceled"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperOrderDetail;
