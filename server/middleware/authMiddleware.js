import { getAuth } from "@clerk/express";
import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId || req.auth?.userId;

    if (!userId) {
      return res.json({ success: false, message: "not authenticated" });
    }

    let user = await User.findById(userId);
    if (!user) {
      user = await User.create({
        _id: userId,
        username: "User",
        email: `${userId}@clerk.user`,
      });
    }

    req.user = user;
    req.auth = { ...(req.auth || {}), userId };
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};