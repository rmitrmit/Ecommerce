/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Tải các biến môi trường từ file .env trong thư mục server (ổn định với mọi CWD)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const config = {
    // Cấu hình Server
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || "development",

    // Cấu hình Database
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },

    // Cấu hình CORS
    cors: {
        origin: function (origin, callback) {
            // Cho phép requests không có origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            const allowedOrigins = [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                process.env.CORS_ORIGIN,
            ].filter(Boolean);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    },

    // Cấu hình JWT
    jwt: {
        secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
        expire: process.env.JWT_EXPIRE || "7d",
    },

    // Cấu hình Session
    session: {
        secret: process.env.SESSION_SECRET || "your-super-secret-session-key",
        ttl: parseInt(process.env.SESSION_TTL) || 24 * 60 * 60 * 1000, // 24 giờ
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: parseInt(process.env.SESSION_TTL) || 24 * 60 * 60 * 1000, // 24 giờ
        },
    },

    // Upload file
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    },

    // Cấu hình API
    api: {
        prefix: "/api",
        version: "v1",
    },
};

export default config;
