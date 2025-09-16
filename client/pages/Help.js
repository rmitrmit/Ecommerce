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

const Help = () => {
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
                                    <h3 className="title">Help Center</h3>
                                    <p style={{ color: "#777", marginTop: 6 }}>
                                        Find answers to your questions here.
                                    </p>
                                </div>

                                <p style={{ color: "#777", marginBottom: 16 }}>
                                    Welcome to our Help Center. Below are some of our most frequently asked questions. If you can't find what you're looking for, please visit our <Link to="/contact" style={{ color: "blue" }}>Contact Us</Link> page.
                                </p>
                                
                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        How do I track my order?
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        You can track your order by logging into your account and visiting the "My Orders" section.
                                    </p>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        What is your return policy?
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        You can return products within 30 days of purchase, provided they are in their original condition. See our <Link to="/terms" style={{ color: "blue" }}>Terms and Conditions</Link> for full details.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        Is my personal information secure?
                                    </h4>
                                    <p style={{ color: "#777", margin: 0 }}>
                                        Yes, we take your privacy very seriously. You can read our full <Link to="/privacy-policy" style={{ color: "blue" }}>Privacy Policy</Link> for more information on how we protect your data.
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

export default Help;