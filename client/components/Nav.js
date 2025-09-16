/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJson } from "../utils/api";

const Nav = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getJson("/api/products/categories");
                setCategories(
                    Array.isArray(data?.categories) ? data.categories : []
                );
            } catch (e) {
                setCategories([]);
            }
        };
        load();
    }, []);

    return (
        <nav id="navigation">
            <div className="container">
                <div id="responsive-nav">
                    <ul className="main-nav nav navbar-nav">
                        <li className="active">
                            <Link to="/">Home</Link>
                        </li>
                        {categories.map((name) => (
                            <li key={name}>
                                <Link
                                    to={`/products?category=${encodeURIComponent(
                                        name
                                    )}`}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
