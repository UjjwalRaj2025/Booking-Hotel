import Hotel from "../models/Hotel.js";
import {v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { json } from "express";

// API to create a new room for a hotel
export const createRoom = async(req, res)=>{
    try {
        const{roomName, roomType, pricePerNight, amenities}= req.body;
        const owner = req.user?._id || req.auth?.userId;
        const hotel = await Hotel.findOne({owner});

        if(!hotel) return res.json({success: false, message: "No Hotel Found"});
        // images upload to cloudnianry
        const uploadImages = req.files.map(async (file) =>{
            const response =await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        //wait for all uploads to complete
        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel:hotel._id,
            roomName: roomName || roomType,
            roomType,
            pricePerNight: +pricePerNight,
            amenities:JSON.parse(amenities),
            images
        })
        res.json({success: true, message:"Room created Successfully"})        
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }


}


// API to get all rooms
export const getRooms = async (req, res)=>{
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path:'hotel',
            populate:{
                path:'owner',
                select:'image'
            }
        }).sort({createdAt:-1})
        res.json({success: true, rooms})
    } catch (error) {
       res.json({success:false,message:error.message}); 
    }
}

//API to get all rooms for specific hotel
export const getOwnerRooms = async(req, res)=>{
    try{
        const owner = req.user?._id || req.auth?.userId;
        const hotelData = await Hotel.findOne({owner});
        if (!hotelData) return res.json({success: false, message: "No Hotel Found"});
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate('hotel');

        const today = new Date();
        const roomsWithBookingStatus = await Promise.all(
            rooms.map(async (roomDoc) => {
                const roomObj = roomDoc.toObject();
                // Find active or upcoming bookings for this room
                const activeBooking = await Booking.findOne({
                    room: roomDoc._id.toString(),
                    status: { $ne: "cancelled" },
                    checkInDate: { $lte: today },
                    checkOutDate: { $gte: today }
                }).populate("user");

                const upcomingBooking = await Booking.findOne({
                    room: roomDoc._id.toString(),
                    status: { $ne: "cancelled" },
                    checkInDate: { $gt: today }
                }).sort({ checkInDate: 1 }).populate("user");

                const latestBooking = await Booking.findOne({
                    room: roomDoc._id.toString(),
                    status: { $ne: "cancelled" }
                }).sort({ createdAt: -1 }).populate("user");

                roomObj.isCurrentlyBooked = Boolean(activeBooking);
                roomObj.currentBooking = activeBooking || null;
                roomObj.upcomingBooking = upcomingBooking || null;
                roomObj.latestBooking = latestBooking || null;
                return roomObj;
            })
        );

        res.json({success:true, rooms: roomsWithBookingStatus});
    }catch(error){
        res.json({success:false, message: error.message});
    }
}

//API to toggle availibilty of a room
export const toggleRoomAvailability = async (req, res)=>{
    try {
        const {roomId } = req.body;
        const roomData= await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message:"Room availibility Updated"})
    } catch (error) {
        res.json({success: false, message:error.message})
        
    }
}