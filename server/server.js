import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();

app.use(cors());

// Clerk webhook FIRST (raw body)
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Then JSON parser for the rest of your API
app.use(express.json());

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));