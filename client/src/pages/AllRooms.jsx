import React, { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const CheckBox =({label, selected = false, onChange =() => { }})=>{
return (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="checkbox" checked={ selected} onChange={(e) => onChange(e.target.checked, label)}/>
    <span className="font-light select-none">{label}</span>
  </label>
)
}

const RadioButton =({label, selected = false, onChange =() => { }})=>{
return (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="radio" name="sortOption" checked={ selected} onChange={() => onChange(label)}/>
    <span className="font-light select-none">{label}</span>
  </label>
)
}



const AllRooms = () => {
  const navigate= useNavigate();
  const [openFilters,setOpenFilters]= useState(false)

  const roomTypes=[
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ];

  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 3000',
  ];

  const SortOptions=[
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-32 px-4 md:px-16 lg:px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className ='text-sm md:text-base text-gray-500/90 mt-2'>Take advantage of our limited-time offers and special packages to enhance your <br/>stay and create unforgatable memories.</p>
        </div>

       {roomsDummyData.map((room) => (
  <div
    key={room._id}
    className="flex flex-col md:flex-row gap-6 py-10 border-b border-gray-300 last:border-0"
  >
    {/* Room Image */}
    <img
      onClick={() => {
        navigate(`/rooms/${room._id}`);
        window.scrollTo(0, 0);
      }}
      src={room.images[0]}
      alt="hotel-img"
      title="View Room Details"
      className="w-full md:w-[45%] h-72 object-cover rounded-xl shadow-lg cursor-pointer"
    />

    {/* Room Details */}
    <div className="flex-1 flex flex-col justify-center">

      <p className="text-gray-500">{room.hotel.city}</p>

      <h2
        onClick={() => {
          navigate(`/rooms/${room._id}`);
          window.scrollTo(0, 0);
        }}
        className="font-playfair text-4xl text-gray-900 cursor-pointer mt-1"
      >
        {room.hotel.name}
      </h2>

      {/* Rating */}
      <div className="flex items-center mt-2">
        <StarRating />
        <span className="ml-2 text-gray-700">200+ reviews</span>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 mt-3 text-gray-500">
        <img
          src={assets.locationIcon}
          alt="location"
          className="w-4 h-4"
        />
        <span>{room.hotel.address}</span>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-3 mt-5">
        {room.amenities.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#F5F5FF]"
          >
            <img
              src={facilityIcons[item]}
              alt={item}
              className="w-5 h-5"
            />
            <p className="text-sm text-gray-600">{item}</p>
          </div>
        ))}
      </div>
      {/* Rooms Price */}
      <p className="text-xl font-medium text-gray-700">
        <br/>${room.pricePerNight}/night </p>

    </div>
  </div>
))}
</div>


      <div className="bg-white w-80 border border-black text-gray-600 max-lg:mb-8 lg:mt-16">

  <div
    className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${
      openFilters ? "border-b" : ""
    }`}
  >
    <p className="text-base font-medium text-gray-800">
      FILTERS
    </p>

    <div className="text-xs cursor-pointer">
      <span
        onClick={() => setOpenFilters(!openFilters)}
        className="lg:hidden"
      >
        {openFilters ? "HIDE" : "SHOW"}
      </span>

      <span className="hidden lg:block">CLEAR</span>
    </div>
  </div>

  <div
    className={`${
      openFilters ? "h-auto" : "h-0 lg:h-auto"
    } overflow-hidden transition-all duration-700`}
  >
    <div className="px-5 pt-5">
      <p className="font-medium text-gray-800 pb-2">
        Popular Filters
      </p>

      {roomTypes.map((room, index) => (
        <CheckBox key={index} label={room} />
      ))}
    </div>

    <div className="px-5 pt-5">
      <p className="font-medium text-gray-800 pb-2">
        Price Range
      </p>

      {priceRanges.map((range, index) => (
        <CheckBox key={index} label={`$ ${range}`} />
      ))}
    </div>

    <div className="px-5 pt-5 pb-7">
      <p className="font-medium text-gray-800 pb-2">
        Sort By
      </p>

      {SortOptions.map((option, index) => (
        <RadioButton key={index} label={option} />
      ))}
    </div>
  </div>
</div>

        </div>

       
        


  )
}

export default AllRooms
