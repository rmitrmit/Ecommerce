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
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../store/slices/ordersSlice";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, loading, error } = useSelector(
        (state) => state.cart
    );
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [customerAddress, setCustomerAddress] = useState(user?.address || "");

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (!customerAddress.trim()) {
            alert("Please enter delivery address");
            return;
        }

        try {
            await dispatch(createOrder({ customerAddress })).unwrap();
            // Redirect to home page after successful order
            navigate("/");
        } catch (error) {
            alert(`Error: ${error}`);
        }
    };

    if (items.length === 0) {
        return (
            <div>
                <div className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h3>Your cart is empty</h3>
                                <Link to="/products" className="primary-btn">
                                    Continue shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="section" style={{ paddingTop: 24 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-title">
                                <h3 className="title">Checkout</h3>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div
                                style={{
                                    background: "white",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    borderRadius: 12,
                                    padding: 24,
                                    marginBottom: 24,
                                }}
                            >
                                <h4 style={{ marginTop: 0, marginBottom: 20 }}>
                                    Delivery information
                                </h4>
                                <div className="form-group">
                                    <label>Address *</label>
                                    <textarea
                                        value={customerAddress}
                                        onChange={(e) =>
                                            setCustomerAddress(e.target.value)
                                        }
                                        placeholder="Enter delivery address..."
                                        style={{
                                            width: "100%",
                                            padding: 12,
                                            border: "1px solid #ddd",
                                            borderRadius: 6,
                                            minHeight: 80,
                                            resize: "vertical",
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    background: "white",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    borderRadius: 12,
                                    padding: 24,
                                }}
                            >
                                <h4 style={{ marginTop: 0, marginBottom: 20 }}>
                                    Order summary
                                </h4>
                                {items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className="row"
                                        style={{
                                            borderBottom: "1px solid #eee",
                                            padding: "10px 0",
                                        }}
                                    >
                                        <div className="col-sm-8">
                                            <strong>{item.product.name}</strong>
                                            <div
                                                style={{
                                                    color: "#777",
                                                    marginTop: 4,
                                                }}
                                            >
                                                Quantity: {item.quantity}
                                            </div>
                                        </div>
                                        <div className="col-sm-4 text-right">
                                            <strong>
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div
                                className="order-summary"
                                style={{
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    borderRadius: 6,
                                    padding: 16,
                                }}
                            >
                                <h4 style={{ marginTop: 0 }}>Checkout</h4>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <span>Subtotal</span>
                                    <strong>
                                        {totalAmount.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </strong>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <span>Shipping fee</span>
                                    <strong>Free</strong>
                                </div>
                                <hr />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 12,
                                    }}
                                >
                                    <span>Total</span>
                                    <strong style={{ color: "#D10024" }}>
                                        {totalAmount.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </strong>
                                </div>
                                <button
                                    className="primary-btn"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    style={{ width: "100%" }}
                                >
                                    {loading ? "Loading..." : "Order"}
                                </button>
                                {error && (
                                    <div
                                        style={{
                                            color: "#D10024",
                                            marginTop: 8,
                                            textAlign: "center",
                                        }}
                                    >
                                        {error}
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

export default Checkout;
