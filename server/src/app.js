/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/index.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import hubRoutes from "./routes/hubs.js";

import { API_ENDPOINTS } from "./constants/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "http://localhost:3001"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
            },
        },
    })
);

app.use(cors(env.cors));

app.use(compression());

app.use(morgan("combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const sessionConfig = {
    ...env.session,
    cookie: {
        ...env.session.cookie,
        maxAge: env.session.ttl,
    },
};

if (env.mongodb.uri) {
    sessionConfig.store = MongoStore.create({
        mongoUrl: env.mongodb.uri,
        ttl: Math.floor(env.session.ttl / 1000),
    });
}

app.use(session(sessionConfig));

app.use(
    "/uploads",
    (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
    express.static(path.join(__dirname, "../uploads"))
);
app.use(API_ENDPOINTS.AUTH, authRoutes);
app.use(API_ENDPOINTS.PRODUCTS, productRoutes);
app.use(API_ENDPOINTS.CART, cartRoutes);
app.use(API_ENDPOINTS.ORDERS, orderRoutes);
app.use(API_ENDPOINTS.HUBS, hubRoutes);

app.get(API_ENDPOINTS.HEALTH, (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.nodeEnv,
        version: "1.0.0",
    });
});

app.use("*", (req, res) => {
    res.status(404).json({
        error: "API endpoint không tồn tại",
        path: req.originalUrl,
        method: req.method,
    });
});

app.use((err, req, res, next) => {

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            error: "Dữ liệu không hợp lệ",
            details: errors,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            error: `${field} đã tồn tại`,
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            error: "Token không hợp lệ",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            error: "Token đã hết hạn",
        });
    }
    res.status(500).json({
        error: "Lỗi server nội bộ",
        ...(env.nodeEnv === "development" && { stack: err.stack }),
    });
});

export default app;
