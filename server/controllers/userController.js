import User from "../models/User.js";
import { getAuth } from "@clerk/express";

// Sync / Get User data
export const syncUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { username, email, image } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      user = await User.create({
        _id: userId,
        username: username || "User",
        email: email || "",
        image: image || "",
      });
      console.log("✅ User created in MongoDB via sync API:", userId);
    } else {
      // Optionally update user info if provided
      let updated = false;
      if (username && user.username !== username) {
        user.username = username;
        updated = true;
      }
      if (email && user.email !== email) {
        user.email = email;
        updated = true;
      }
      if (image && user.image !== image) {
        user.image = image;
        updated = true;
      }
      if (updated) {
        await user.save();
        console.log("✅ User updated in MongoDB via sync API:", userId);
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Error syncing user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
