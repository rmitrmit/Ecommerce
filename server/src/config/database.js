import mongoose from "mongoose";
import "dotenv/config"; // Ensure this is at the top of your main server file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI); // Use process.env directly

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected.");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB reconnected.");
        });

        console.log("MongoDB connected successfully!");

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;