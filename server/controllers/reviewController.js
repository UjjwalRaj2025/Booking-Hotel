import Review from "../models/Review.js";
import User from "../models/User.js";

// Initial default fallback reviews if DB is empty
const defaultReviews = [
  {
    _id: "default_1",
    name: "Emma Rodriguez",
    city: "Barcelona, Spain",
    userImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    rating: 5,
    review: "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that StaYzo provides."
  },
  {
    _id: "default_2",
    name: "Liam Johnson",
    city: "New York, USA",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    rating: 4,
    review: "StaYzo exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!"
  },
  {
    _id: "default_3",
    name: "Sophia Lee",
    city: "Seoul, South Korea",
    userImage: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
    rating: 5,
    review: "Amazing service! I always find the best luxury accommodations through StaYzo. Their recommendations never disappoint!"
  }
];

// Helper to check if string is raw Clerk ID
const isRawClerkId = (str) => !str || str.startsWith("user_") || str === "User";

// API to submit a new review
export const createReview = async (req, res) => {
  try {
    const { rating, review, city, name: reqName, userImage: reqImage } = req.body;
    const userId = req.user?._id || req.auth?.userId;

    if (!userId) {
      return res.json({ success: false, message: "Authentication required to post a review." });
    }

    if (!rating || !review || review.trim().length === 0) {
      return res.json({ success: false, message: "Please provide both a star rating and a review text." });
    }

    const userDoc = req.user || (await User.findById(userId));
    
    // Determine user display name
    let displayName = reqName;
    if (isRawClerkId(displayName)) {
      if (userDoc?.username && !isRawClerkId(userDoc.username)) {
        displayName = userDoc.username;
      } else if (userDoc?.email && !userDoc.email.endsWith("@clerk.user") && !isRawClerkId(userDoc.email)) {
        displayName = userDoc.email.split("@")[0];
      } else {
        displayName = "Verified Traveler";
      }
    }

    const avatar = reqImage || userDoc?.image || "";

    const newReview = await Review.create({
      user: userId,
      name: displayName,
      city: city || "Verified Guest",
      userImage: avatar,
      rating: Number(rating),
      review: review.trim()
    });

    res.json({
      success: true,
      message: "Thank you! Your review has been submitted successfully.",
      review: newReview
    });
  } catch (error) {
    console.error("createReview Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get all reviews (limits to 5 most recent reviews)
export const getReviews = async (req, res) => {
  try {
    const dbReviews = await Review.find().sort({ createdAt: -1 }).limit(5).lean();
    
    // Clean up any reviews that have raw clerk user_ IDs in the name field
    const cleanedReviews = await Promise.all(
      dbReviews.map(async (rev) => {
        if (isRawClerkId(rev.name) || rev.name === rev.user) {
          const u = await User.findById(rev.user);
          if (u && u.username && !isRawClerkId(u.username)) {
            rev.name = u.username;
            if (u.image) rev.userImage = u.image;
          } else {
            rev.name = "Verified Guest";
          }
        }
        return rev;
      })
    );
    
    // Merge DB reviews with default fallback reviews if DB has few entries
    const combined = [...cleanedReviews];
    if (combined.length < 5) {
      defaultReviews.forEach((def) => {
        if (!combined.some((r) => r.review === def.review)) {
          combined.push(def);
        }
      });
    }

    res.json({ success: true, reviews: combined.slice(0, 5) });
  } catch (error) {
    console.error("getReviews Error:", error.message);
    res.json({ success: false, message: error.message, reviews: defaultReviews.slice(0, 5) });
  }
};
