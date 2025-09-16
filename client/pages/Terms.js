/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div>
            <div className="section" style={{ paddingTop: 30 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <div
                                className="billing-details"
                                style={{
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    borderRadius: 6,
                                    padding: 24,
                                }}
                            >
                                <div
                                    className="section-title"
                                    style={{ marginBottom: 16 }}
                                >
                                    <h3 className="title">Terms and Conditions</h3>
                                </div>

                                <p style={{ color: "#777", marginBottom: 16 }}>
                                    These Terms of Service govern your use of our services. By accessing or using our platform, you agree to be bound by these terms.
                                </p>
                                
                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        1. Account Creation
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account password.
                                    </p>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        2. User Conduct
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        You agree not to use the service for any unlawful purpose or in any way that could harm the platform or its users.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        3. Intellectual Property
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        All content on this site, including text, graphics, logos, and images, is the property of Online Electronic and protected by copyright laws.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;