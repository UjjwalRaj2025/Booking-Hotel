import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { userBookingsDummyData, assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const MyBookings = () => {
    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState(userBookingsDummyData);

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) return;
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/bookings/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success && data.bookings && data.bookings.length > 0) {
                    setBookings(data.bookings);
                }
            } catch (error) {
                console.error("Failed to fetch user bookings:", error);
            }
        };

        fetchUserBookings();
    }, [user]);

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title
                title='My Bookings'
                subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks.'
                align='left'
            />

            <div className='max-w-6xl mt-8 w-full text-gray-800'>

                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] border-b border-gray-300 font-medium text-base py-3'>
                    <div>Hotels</div>
                    <div>Date & Timing</div>
                    <div>Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b border-gray-300 py-6 first:border-t'
                    >
                        {/* Hotel Details */}
                        <div className='flex flex-col md:flex-row'>
                            <img
                                src={booking.room.images[0]}
                                alt="hotel-img"
                                className='w-full md:w-44 rounded shadow object-cover'
                            />

                            <div className='flex flex-col gap-1.5 mt-3 md:mt-0 md:ml-4'>
                                <p className='font-playfair text-2xl'>
                                    {booking.hotel.name}
                                    <span className='font-inter text-sm ml-2'>
                                        ({booking.room.roomType})
                                    </span>
                                </p>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking.hotel.address}</span>
                                </div>

                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Guests: {booking.guests}</span>
                                </div>

                                <p className='text-base'>
                                    Total: ${booking.totalPrice}
                                </p>
                            </div>
                        </div>

                        {/* Date & Timing */}
<div className="flex flex-col justify-center gap-2 mt-4 md:mt-0">
    <p>
        <span className="font-medium">Check In:</span>{" "}
        {new Date(booking.checkInDate).toLocaleDateString()}
    </p>

    <p>
        <span className="font-medium">Check Out:</span>{" "}
        {new Date(booking.checkOutDate).toLocaleDateString()}
    </p>

    <p className="text-gray-500 text-sm">
        Booked on{" "}
        {new Date(booking.createdAt).toLocaleDateString()}
    </p>
</div>

{/* Payment */}
<div className="flex flex-col justify-center items-start md:items-center gap-3 mt-4 md:mt-0">
    <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
        }`}
    >
        {booking.isPaid ? "Paid" : "Pending"}
    </span>

    <button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:scale-105">
  View Details
</button>
</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;