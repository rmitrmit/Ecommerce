/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedDatabase } from "./utils/seedData.js";

// Tải các biến môi trường
dotenv.config();

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        process.exit(1);
    }
};

// Hàm chính
const main = async () => {
    try {
        await connectDB();
        await seedDatabase();
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

// Chạy seeding
main();
