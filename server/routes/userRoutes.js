import express from "express";
import { getUserData, storeRecentSearchedCities, syncUser, subscribeNewsletter } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities);
userRouter.post('/sync', protect, syncUser);
userRouter.post('/subscribe', subscribeNewsletter);

export default userRouter;
