import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div
      className="flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${assets.heroImage})` }}
    >
      <p className='w-fit bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
      <p className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</p>
      <p className="max-w-130 mt-3 text-sm md:text-base">Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts.Start your journey today.</p>

      <form onSubmit={handleSearch} className="w-fit mt-12 bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto">
        <div className="relative">
          <div className='flex items-center gap-2'>
            <img src={assets.locationIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input 
            id="destinationInput" 
            type="text" 
            autoComplete="off"
            value={destination}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setDestination(e.target.value);
              setIsDropdownOpen(true);
            }}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800 w-full md:w-48" 
            placeholder="Select or Type City" 
            required 
          />

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <ul className="absolute left-0 top-full mt-1.5 w-full max-h-56 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-2xl overflow-y-auto z-20">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setDestination(city);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2.5 hover:bg-blue-50 text-sm cursor-pointer border-b border-gray-100 last:border-0 font-medium text-gray-700"
                    >
                      {city}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2.5 text-xs text-gray-400">No matching city found</li>
                )}
              </ul>
            </>
          )}
        </div>

            <div>
                <div className='flex items-center gap-2'>
                  
                  <img src={assets.locationIcon} alt="" className="h-4" />
                  <label htmlFor="checkIn">Check in</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.locationIcon} alt="" className="h-4" />
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="searchicon" className="h-7" />
                <span>Search</span>
            </button>
        </form>
    </div>
  );
};

export default Hero; 