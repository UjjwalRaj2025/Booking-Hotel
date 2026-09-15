import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { sendBookingConfirmationEmail } from "../utils/emailService.js";

//function to check availibilty of room
const checkAvailibility = async ({checkInDate, checkOutDate, room}) =>{
    try {
        const bookings = await Booking.find({
            room,
            status: { $ne: "cancelled" },
            checkInDate: { $lt: new Date(checkOutDate) },
            checkOutDate: { $gt: new Date(checkInDate) },
        });
        return bookings.length === 0;
    } catch (error) {
        console.error("checkAvailibility error:", error.message);
        return true;
    }
}

//API to check availibilty of room
//Post /api/booking/check-availibility
export const checkAvailibilityAPI = async (req, res)=>{
    try {
        const roomId = req.body.room || req.body.roomId;
        const { checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailibility({ checkInDate, checkOutDate, room: roomId });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//API to create a new booking 
// POST /api/booking/book
export const createBooking = async (req, res)=>{
    try {
        const roomId = req.body.room || req.body.roomId;
        const { checkInDate, checkOutDate, guests } = req.body;
        const userId = req.user?._id || req.auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }
        if (!roomId) {
            return res.json({ success: false, message: "Room ID is required" });
        }

        //before booking check availibility
        const isAvailable = await checkAvailibility({
            checkInDate,
            checkOutDate,
            room: roomId
        });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available for selected dates" });
        }

        //Get totalPrice from Room
        const roomData = await Room.findById(roomId).populate("hotel");
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        const totalPrice = roomData.pricePerNight * nights;
        const hotelId = roomData.hotel?._id || roomData.hotel;

        const booking = await Booking.create({
            user: userId,
            room: roomId,
            hotel: hotelId,
            guests: Number(guests) || 1,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
            paymentMethod: req.body.paymentMethod || "Pay At Hotel",
            status: "confirmed"
        });

        // Send booking confirmation email asynchronously (does not block response)
        const recipientEmail = req.body.guestEmail || 
            (req.user?.email && !req.user.email.endsWith("@clerk.user") ? req.user.email : process.env.SENDER_EMAIL || "ujjwal2007r@gmail.com");

        const guestDisplayName = req.body.guestName || req.user?.username || "Valued Guest";

        sendBookingConfirmationEmail({
            toEmail: recipientEmail,
            userName: guestDisplayName,
            bookingId: booking._id,
            hotelName: roomData.hotel?.name || "Luxury Hotel",
            hotelAddress: roomData.hotel?.address || "",
            hotelCity: roomData.hotel?.city || "",
            roomName: roomData.roomName || roomData.roomType || "Standard Room",
            roomType: roomData.roomType || "Deluxe",
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            nights,
            guests: booking.guests,
            pricePerNight: roomData.pricePerNight,
            totalPrice: booking.totalPrice,
            paymentMethod: booking.paymentMethod
        }).catch(err => console.error("Async email error:", err));

        res.json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.json({ success: false, message: error.message || "Failed to create Booking" });
    }
};


//API to get all booking for a user
//GET /api/bookings/user

export const getUserBooking = async (req,res) => {
    try {
        const userId = req.user?._id || req.auth?.userId;
        const bookings = await Booking.find({ user: userId }).populate("room hotel").sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message:"Failed to fetch bookings"});
    }
}
export const getHotelBookings = async (req,res)=>{
   try {
    const owner = req.user?._id || req.auth?.userId;
    const hotel = await Hotel.findOne({ owner });
    if(!hotel){
        return res.json({ success: true, dashboardData: { totalBookings: 0, totalRevenue: 0, bookings: [] } });
    }
    const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});
    //Total Bookings
    const totalBookings = bookings.length;
    //Total Revenue
    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice, 0);

    res.json({success:true,dashboardData:{totalBookings, totalRevenue, bookings}});

   } catch (error) {
        res.json({success:false,message:error.message});
   }
}