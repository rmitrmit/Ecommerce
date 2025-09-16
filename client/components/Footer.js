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

const Footer = () => {
    return (
        <footer id="footer">
            {/* top footer */}
            <div className="section">
                {/* container */}
                <div className="container">
                    {/* row */}
                    <div className="row">
                        {/* footer widget */}
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">About us</h3>
                                <p> We are group 13
                                </p>
                                <ul className="footer-links">
                                    <li>
                                        <span>
                                            <i className="fa fa-map-marker"></i>
                                            123 Nguyen Van Linh Street, District 7, Ho Chi Minh City
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <i className="fa fa-phone"></i>
                                            +84-123-456-789
                                        </span>
                                    </li>
                                    <li>
                                        <span>
                                            <i className="fa fa-envelope-o"></i>
                                            support@group13.vn
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /footer widget */}

                        {/* Đã xóa footer Danh mục */}

                        {/* footer widget */}
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Navigation</h3>
                                <ul className="footer-links">
                                    <li>
                                        <Link to="/about-us">About us</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">Contact</Link>
                                    </li>
                                    <li>
                                        <Link to="/privacy">
                                            Privacy policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/help">Help</Link>
                                    </li>
                                    <li>
                                        <Link to="/terms">
                                            Terms
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /footer widget */}

                        {/* footer widget */}
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Shop</h3>
                                <ul className="footer-links">
                                    <li>
                                        <Link to="/my-account">Account</Link>
                                    </li>
                                    <li>
                                        <Link to="/cart">Cart</Link>
                                    </li>
                                    <li>
                                    <Link to="/my-account">Track my order</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /footer widget */}
                    </div>
                    {/* /row */}
                </div>
                {/* /container */}
            </div>
            {/* /top footer */}

            {/* bottom footer */}
            <div id="bottom-footer" className="section">
                <div className="container">
                    {/* row */}
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <ul className="footer-payments">
                                <li>
                                    <span>
                                        <i className="fa fa-cc-visa"></i>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <i className="fa fa-cc-paypal"></i>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <i className="fa fa-cc-mastercard"></i>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <i className="fa fa-cc-discover"></i>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <i className="fa fa-cc-amex"></i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* /row */}
                </div>
                {/* /container */}
            </div>
            {/* /bottom footer */}
        </footer>
    );
};

export default Footer;
