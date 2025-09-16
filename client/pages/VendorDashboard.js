/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from "react";
import { Link } from "react-router-dom";
import VendorLayout from "../layouts/VendorLayout";

const VendorDashboard = () => {
    return (
        <VendorLayout>
            <div
                className="container"
                style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
                {/* Quick Actions */}
                <div className="row" style={{ marginBottom: "24px" }}>
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
                                Product Management
                            </h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <Link
                                        to="/vendor/add-product"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div
                                            style={{
                                                padding: "24px",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "8px",
                                                textAlign: "center",
                                                transition: "all 0.3s",
                                                cursor: "pointer",
                                                backgroundColor: "white",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.borderColor =
                                                    "#ee4d2d";
                                                e.target.style.backgroundColor =
                                                    "#fff5f5";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.borderColor =
                                                    "#e0e0e0";
                                                e.target.style.backgroundColor =
                                                    "white";
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    fontWeight: "600",
                                                    marginBottom: "8px",
                                                    color: "#333",
                                                }}
                                            >
                                                Add New Product
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#666",
                                                }}
                                            >
                                                Create a new product for your
                                                shop
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link
                                        to="/vendor/my-products"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div
                                            style={{
                                                padding: "24px",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "8px",
                                                textAlign: "center",
                                                transition: "all 0.3s",
                                                cursor: "pointer",
                                                backgroundColor: "white",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.borderColor =
                                                    "#ee4d2d";
                                                e.target.style.backgroundColor =
                                                    "#fff5f5";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.borderColor =
                                                    "#e0e0e0";
                                                e.target.style.backgroundColor =
                                                    "white";
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "18px",
                                                    fontWeight: "600",
                                                    marginBottom: "8px",
                                                    color: "#333",
                                                }}
                                            >
                                                My Products
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#666",
                                                }}
                                            >
                                                View and manage all products
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
};

export default VendorDashboard;
