/**
 * RMIT University Vietnam
 * Course: COSC2769 - Full Stack Development
 * Semester: 2025B
 * Assessment: Assignment 02
 * Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 * ID: 4053400, 3975542, 3988413
 */

import app from "./app.js";
import { connectDB, env } from "./config/index.js";
import { seedDatabase } from "./utils/seedData.js";

// Connect MongoDB
connectDB();

// Seed database with sample data
seedDatabase();

// Start server
const PORT = env.port;
app.listen(PORT, () => {});
