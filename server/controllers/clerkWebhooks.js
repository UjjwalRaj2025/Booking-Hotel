import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async ()=> {
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const header ={
            "svix-id": requestAnimationFrame.headers["svix-id"],
            "svix-timestamp": requestAnimationFrame.headers["svix-timestamp"],
            "svix-signature": requestAnimationFrame.headers["svix-signature"],
        };

        //verifying Headers
        await whook.verify(JSON.stringify(requestAnimationFrame.body), headers)

        // Geeting Data from request body
        const {data,type} = req.body

        const userData = {
            _id: data.id,
            email:data.email_addresses[0].email_addresses,
            username: data.first_name+" "+ data.last_name,
            image: data.image_url,

        }

//switch Case for digfferent eevents
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
res.json({success: true, message:"Webhook Recieved"})

    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});

        

    }
}

export default clerkWebhooks;