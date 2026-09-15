import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import { useClerk } from '@clerk/react';
import { toast } from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, getToken, axios, user } = useAppContext();
  const { openSignIn } = useClerk();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const selectedRoom = rooms.find((r) => r._id === id) || roomsDummyData.find((r) => r._id === id);

    if (selectedRoom) {
      setRoom(selectedRoom);
      setMainImage(selectedRoom.images?.[0]);
    }
  }, [id, rooms]);

  useEffect(() => {
    const verifyAvailability = async () => {
      if (checkInDate && checkOutDate && room) {
        try {
          setCheckingAvailability(true);
          const { data } = await axios.post("/api/bookings/check-availability", {
            roomId: room._id,
            checkInDate,
            checkOutDate,
          });
          if (data.success) {
            setIsAvailable(data.isAvailable);
          }
        } catch (error) {
          console.error("Availability check error:", error);
        } finally {
          setCheckingAvailability(false);
        }
      } else {
        setIsAvailable(true);
      }
    };
    verifyAvailability();
  }, [checkInDate, checkOutDate, room]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      return openSignIn();
    }
    if (!checkInDate || !checkOutDate) {
      return toast.error("Please select Check-In and Check-Out dates");
    }
    if (!isAvailable) {
      return toast.error("This room is already booked for the selected dates!");
    }
    try {
      setIsBooking(true);
      const token = await getToken();
      const { data } = await axios.post(
        "/api/bookings/book",
        {
          roomId: room._id,
          checkInDate,
          checkOutDate,
          guests: Number(guests),
          guestEmail: user?.primaryEmailAddress?.emailAddress,
          guestName: user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || "Room Booked Successfully!");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  return room && (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* City Badge & Room Header */}
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mb-1">
        <img src={assets.locationIcon} alt="city-icon" className="w-4 h-4 opacity-70" />
        <span>{room.hotel?.city || room.city || "Puducherry"}</span>
      </div>

      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>
          {room.hotel?.name}
          <span className='font-inter text-sm'> ({room.roomType})</span>
        </h1>

        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>

      {/* roomRating */}
      <div className="flex items-center mt-2">
        <StarRating className='flex items-center gap-1'/>
        <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
      </div>

      {/* roomAddress */}
      <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
        <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4 opacity-70" />
        <span>{room.hotel?.address}</span>
      </div>

      {/* room img */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img
            src={mainImage}
            alt="Room Image" 
            className='w-full h-[400px] rounded-xl shadow-lg object-cover'
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2">
          {room?.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Room"
              onClick={() => setMainImage(image)}
              className={`w-full h-44 object-cover rounded-xl cursor-pointer transition ${
                mainImage === image
                  ? "ring-2 ring-orange-500"
                  : "hover:opacity-80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* room Highlights */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10 items-start md:items-center'>
        <div>
          <h2 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h2>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-3'>
            {Array.isArray(room.amenities) && room.amenities.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                {facilityIcons[item] && (
                  <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                )}
                <p className='text-xs text-gray-700'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* room price */}
        <p className='text-2xl font-medium text-gray-800'>${room.pricePerNight}<span className="text-sm text-gray-500">/night</span></p>
      </div>

      {/* checkin checkout form */}
      <form onSubmit={handleBooking} className='flex flex-col bg-white shadow-xl border border-gray-100 p-6 rounded-2xl mx-auto mt-12 max-w-6xl gap-4'>
        
        {!isAvailable && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-bounce">
            <span>⚠️ This room is already booked for the selected dates. Please choose different dates.</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
          <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-600 w-full md:w-auto'>
            <div className='flex flex-col w-full md:w-auto'>
              <label htmlFor="checkInDate" className='font-medium text-sm text-gray-700'>Check-In</label>
              <input
                type="date"
                id='checkInDate'
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='w-px h-12 bg-gray-200 max-md:hidden'></div>

            <div className='flex flex-col w-full md:w-auto'>
              <label htmlFor="checkOutDate" className='font-medium text-sm text-gray-700'>Check-Out</label>
              <input
                type="date"
                id='checkOutDate'
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='w-px h-12 bg-gray-200 max-md:hidden'></div>

            <div className='flex flex-col w-full md:w-auto'>
              <label htmlFor="guests" className='font-medium text-sm text-gray-700'>Guests</label>
              <input
                type="number"
                id='guests'
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className='w-full md:w-24 rounded-lg border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500'
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isBooking || !isAvailable || checkingAvailability}
            className={`rounded-xl max-md:w-full md:px-12 py-3.5 text-base font-medium transition-all cursor-pointer shadow-md ${
              !isAvailable
                ? "bg-red-600 hover:bg-red-700 text-white cursor-not-allowed opacity-80"
                : "bg-black hover:bg-gray-800 text-white active:scale-95 disabled:opacity-50"
            }`}
          >
            {isBooking ? "Booking..." : checkingAvailability ? "Checking..." : !isAvailable ? "Already Booked" : "Book Now"}
          </button>
        </div>
      </form>

      {/* common specifications */}
      <div className='mt-20 space-y-6'>
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-4">
            <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6 h-6 mt-1' />
            <div>
              <p className='text-base font-semibold text-gray-800'>{spec.title}</p>
              <p className='text-gray-500 text-sm mt-0.5'>{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-12 py-8 text-gray-500 text-sm leading-relaxed">
        <p>
          Guests will be allocated on the ground floor according to availability. You get a comfortable two-bedroom apartment with a true luxury atmosphere. The price quoted is for two guests; please select the exact number of guests to update booking details accordingly.
        </p>
      </div>

      {/* hosted by */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-gray-200 pt-8'>
        <div className='flex items-center gap-4'>
          <img
            src={room.hotel?.owner?.image || assets.userIcon}
            alt="Host"
            className='h-14 w-14 rounded-full object-cover border border-gray-300'
          />
          <div>
            <p className='text-lg font-semibold text-gray-800'>Hosted by {room.hotel?.name}</p>
            <div className='flex items-center mt-1'>
              <StarRating />
              <p className='ml-2 text-sm text-gray-600'>200+ reviews</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => toast.success("Contact feature initiated. Host will reach out shortly!")}
          className='bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-medium px-8 py-3 rounded-xl transition cursor-pointer'
        >
          Contact Host
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
