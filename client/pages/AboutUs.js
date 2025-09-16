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

const AboutUs = () => {
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
                                    <h3 className="title">About Us</h3>
                                </div>

                                <p style={{ color: "#777", marginBottom: 16 }}>
                                    Welcome to our project for RMIT University Vietnam, course COSC2769 - Full Stack Development.
                                </p>
                                <p style={{ color: "#777", marginBottom: 16 }}>
                                    This project was developed by:
                                </p>
                                <ul style={{ paddingLeft: 20, color: "#777" }}>
                                    <li style={{ marginBottom: 8 }}>
                                        <Link to="/profile/student1" style={{ color: "blue" }}>Do Van Tung</Link>
                                    </li>
                                    <li style={{ marginBottom: 8 }}>
                                        <Link to="/profile/student2" style={{ color: "blue" }}>Thieu Gia Huy</Link>
                                    </li>
                                    <li style={{ marginBottom: 8 }}>
                                        <Link to="/profile/student3" style={{ color: "blue" }}>Nguyen Phi Long</Link>
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

export default AboutUs;