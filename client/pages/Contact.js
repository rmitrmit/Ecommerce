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

const Contact = () => {
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
                                    <h3 className="title">Contact Us</h3>
                                    <p style={{ color: "#777", marginTop: 6 }}>
                                        We're here to help!
                                    </p>
                                </div>

                                <p style={{ color: "#777", marginBottom: 16 }}>
                                    If you have any questions or concerns, please don't hesitate to reach out to us. We will get back to you as soon as possible.
                                </p>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: 8, color: "#777" }}>
                                        <strong>Email:</strong> support@example.com
                                    </li>
                                    <li style={{ marginBottom: 8, color: "#777" }}>
                                        <strong>Phone:</strong> +84 123 456 789
                                    </li>
                                    <li style={{ marginBottom: 8, color: "#777" }}>
                                        <strong>Address:</strong> 123 Nguyen Van Linh, District 7, Ho Chi Minh City
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;