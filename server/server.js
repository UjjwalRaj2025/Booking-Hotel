import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRoutes from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Connect Database
connectDB()
connectCloudinary();

const app = express();

// CORS
app.use(cors());

// -------------------------------
// Clerk Webhook (MUST COME BEFORE express.json())
// -------------------------------
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// -------------------------------
// Body Parser & Clerk Middleware
// -------------------------------
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("Hotel Booking Backend Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
