import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS
app.use(cors());

// -------------------------------
// Clerk Webhook (MUST COME FIRST)
// -------------------------------
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// -------------------------------
// JSON Middleware
// -------------------------------
app.use(express.json());

// Clerk Middleware
app.use(clerkMiddleware());

// User Routes
app.use("/api/user", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Hotel Booking Backend Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on Port ${PORT}`);
});