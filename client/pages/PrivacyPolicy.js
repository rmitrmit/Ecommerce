import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div>
            <h2>About Us</h2>
            <p>
                Welcome to our project for RMIT University Vietnam, course COSC2769 - Full Stack Development.
            </p>
            <p>
                This project was developed by:
            </p>
            <ul>
                <li>
                    <Link to="/profile/student1">Student 1</Link>
                </li>
                <li>
                    <Link to="/profile/student2">Student 2</Link>
                </li>
                <li>
                    <Link to="/profile/student3">Student 3</Link>
                </li>
            </ul>
        </div>
    );
};

export default PrivacyPolicy;