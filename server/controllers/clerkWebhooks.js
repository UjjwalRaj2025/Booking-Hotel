import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("FULL PAYLOAD:");
    console.log(JSON.stringify(payload, null, 2));

    const data = payload.data;
    const type = payload.type;

    console.log("TYPE:", type);
    console.log("DATA:", data);

    const email =
      data.email_addresses?.[0]?.email_address ||
      data.external_accounts?.[0]?.email_address ||
      "";
    const name = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();
    const username =
      data.username || name || (email ? email.split("@")[0] : "User");
    const image = data.image_url || "";

    if (type === "user.created" || type === "user.updated") {
      await User.findByIdAndUpdate(
        data.id,
        {
          _id: data.id,
          username,
          email,
          image,
        },
        { upsert: true, new: true }
      );

      console.log(`✅ User ${type === "user.created" ? "Created" : "Updated"}`);
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);

      console.log("✅ User Deleted");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
  console.error("========== ERROR ==========");
  console.error(error);
  console.error(error.stack);

  return res.status(400).json({
    success: false,
    message: error.message,
  });
  }
};


export default clerkWebhooks;