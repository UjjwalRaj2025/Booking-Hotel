import Hotel from "../models/Hotel.js";
import User from "../models/User.js";


export const registerHotel = async (req, res)=> {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id || req.auth?.userId;

        // Check if User Already Registered
        let hotel = await Hotel.findOne({owner});
        if (hotel) {
            if (name) hotel.name = name;
            if (address) hotel.address = address;
            if (contact) hotel.contact = contact;
            if (city) hotel.city = city;
            await hotel.save();
            await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
            return res.json({ success: true, message: "Hotel Details & City Updated Successfully", hotel });
        }

        hotel = await Hotel.create({ name, address, contact, city, owner });
        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({ success: true, message: "Hotel Registered Successfully", hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};