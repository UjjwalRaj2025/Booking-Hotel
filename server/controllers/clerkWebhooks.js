import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get webhook headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify webhook
    const payload = whook.verify(req.body, headers);

    const { data, type } = payload;

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses[0].email_address,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ User Created");
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User Updated");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("✅ User Deleted");
        break;

      default:
        console.log(`Unhandled event: ${type}`);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("Webhook Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;