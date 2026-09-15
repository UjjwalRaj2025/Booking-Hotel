import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/all", getReviews);
reviewRouter.post("/add", protect, createReview);

export default reviewRouter;
