import express from "express"
import "dotenv/config";
import cors from "cors";
import { connect } from "mongoose";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRoutes from "./routes/userRoutes.js";

connectDB()

const app = express()
app.use(cors()) //Enable cros-origin resource sharing

//middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerkWebhooks
app.use("/api/clerk", clerkWebhooks);


<<<<<<< HEAD
app.get('/',(req, res)=> res.send('API is working '))
=======
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
>>>>>>> da006e5246d6b69e94669ba5dafcb573baaed78c

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server runnung on port ${PORT}`));