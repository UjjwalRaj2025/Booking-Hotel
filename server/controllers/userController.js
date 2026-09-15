

export const getUserData = async(req, res)=>{
  try {
    const userId = req.user?._id || req.auth?.userId;
    let user = req.user || (await User.findById(userId));
    
    // Check if user owns any hotel in MongoDB
    const hotel = await Hotel.findOne({ owner: userId });
    const isOwner = Boolean(hotel || (user && user.role === "hotelOwner"));

    if (hotel && user && user.role !== "hotelOwner") {
      user.role = "hotelOwner";
      await User.findByIdAndUpdate(userId, { role: "hotelOwner" });
    }

    res.json({
      success: true,
      role: user ? user.role : (isOwner ? "hotelOwner" : "user"),
      isOwner,
      recentSearchedCities: user ? user.recentSearchedCities : [],
      hotel
    });

  } catch(error){
    res.json({success: false, message: error.message});
  }
}

//store user recentr searched Cities
export const storeRecentSearchedCities = async (req, res)=>{
  try{
    const {recentSearchedCity} = req.body;
    const user = req.user;

    if(user.recentSearchedCities.length < 3 ){
      user.recentSearchedCities.push(recentSearchedCity)
    }else{
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity)
    }
    await user.save();
    res.json({success: true, message: "City added"})
  } catch(error){
    res.json({success: false, message: error.message})
  }
}

import Review from "../models/Review.js";

// sync user from Clerk to MongoDB
export const syncUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.auth?.userId || req.body.userId;
    const { username, email, image } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const isRawClerkId = (str) => !str || str.startsWith("user_") || str === userId || str === "User";
    const cleanName = !isRawClerkId(username) ? username : "";

    const user = await User.findByIdAndUpdate(
      userId,
      {
        _id: userId,
        ...(cleanName ? { username: cleanName } : {}),
        ...(email ? { email } : {}),
        ...(image ? { image } : {})
      },
      { upsert: true, new: true }
    );

    // Update any past reviews by this user that currently display raw Clerk IDs or "User"
    const displayName = cleanName || user.username;
    if (!isRawClerkId(displayName)) {
      await Review.updateMany(
        {
          user: userId,
          $or: [
            { name: { $regex: /^user_/i } },
            { name: userId },
            { name: "User" }
          ]
        },
        {
          $set: {
            name: displayName,
            ...(image ? { userImage: image } : {})
          }
        }
      );
    }

    res.json({ success: true, message: "User synced successfully", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Subscribe newsletter & send welcome email
import { sendNewsletterWelcomeEmail } from "../utils/emailService.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }

    sendNewsletterWelcomeEmail({ email }).catch((err) =>
      console.error("Newsletter welcome email error:", err.message)
    );

    res.json({
      success: true,
      message: "Subscription successful! Check your inbox for your $50 welcome voucher 🎉"
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};