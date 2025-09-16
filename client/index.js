/* 
 RMIT University Vietnam
 Course: COSC2769 - Full Stack Development
 Semester: 2025B
 Assessment: Assignment 02
 Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 ID: 4053400, 3975542, 3988413
*/


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/font-awesome.min.css";
import "./assets/css/nouislider.min.css";
import "./assets/css/slick.css";
import "./assets/css/slick-theme.css";
import "./assets/css/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
