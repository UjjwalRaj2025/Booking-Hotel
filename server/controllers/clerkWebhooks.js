import User from "../models/User.js";
import { Webhook } from "svix";

<<<<<<< HEAD
const clerkWebhooks = async (req, res)=>{
    try{
        //Create a Svix instanve with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Geeting Headers
        const headers={
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body),headers)

        //Geeting Data from request body
        const{data,type}= req.body

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image:data.image_url,
        }

        //switch cases fordifferent events
        switch(type){
            case "user.created":{
                await User.create(userData);
                break;
            }

            case "user.updated":{
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

             case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;

        }
        res.json({success:true, message: "Webhoook Recieved"})

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
        
    }
}
=======
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
>>>>>>> da006e5246d6b69e94669ba5dafcb573baaed78c

export default clerkWebhooks;