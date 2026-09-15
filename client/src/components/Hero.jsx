import React, { useState, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const heroSlides = [
  {
    image: assets.heroImage,
    tagline: "The Ultimate Hotel Experience",
    title: "Discover Your Perfect Gateway Destination",
    subtitle: "Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today."
  },
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop",
    tagline: "Tropical Paradise Resorts",
    title: "Experience World-Class Luxury & Serenity",
    subtitle: "Immerse yourself in breathtaking ocean views, private villas, and unforgettable experiences curated just for you."
  },
  {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2000&auto=format&fit=crop",
    tagline: "Boutique & Heritage Stays",
    title: "Unwind In Elegance & Unmatched Comfort",
    subtitle: "From mountain retreats to coastal paradises, find handpicked accommodations with premium amenities."
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="relative flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 h-screen text-white overflow-hidden">
      {/* Background Images with Cross-Fade Slide Effect */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100 pointer-events-none"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />

      {/* Hero Content */}
      <div className="relative z-10">
        <p className="w-fit bg-[#49B9FF]/50 backdrop-blur-md px-4 py-1 rounded-full mt-20 text-xs sm:text-sm font-medium tracking-wide border border-white/20">
          {heroSlides[currentSlide].tagline}
        </p>

        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl md:text-[56px] md:leading-[60px] font-bold md:font-extrabold max-w-xl mt-4 drop-shadow-md transition-all duration-700">
          {heroSlides[currentSlide].title}
        </h1>

        <p className="max-w-xl mt-3 text-sm md:text-base text-gray-200 drop-shadow-sm transition-all duration-700">
          {heroSlides[currentSlide].subtitle}
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="w-fit mt-8 sm:mt-10 bg-white/95 backdrop-blur-md text-gray-700 rounded-2xl px-5 sm:px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 shadow-2xl border border-white/20"
        >
          <div className="relative w-full md:w-auto">
            <div className="flex items-center gap-2">
              <img src={assets.locationIcon} alt="" className="h-4 opacity-70" />
              <label htmlFor="destinationInput" className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Destination
              </label>
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
              className="rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none text-gray-800 w-full md:w-48 focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
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
            <div className="flex items-center gap-2">
              <img src={assets.locationIcon} alt="" className="h-4 opacity-70" />
              <label htmlFor="checkIn" className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Check in
              </label>
            </div>
            <input
              id="checkIn"
              type="date"
              className="rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none text-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <img src={assets.locationIcon} alt="" className="h-4 opacity-70" />
              <label htmlFor="checkOut" className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Check out
              </label>
            </div>
            <input
              id="checkOut"
              type="date"
              className="rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none text-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
            <label htmlFor="guests" className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
              Guests
            </label>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              className="rounded-lg border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none text-gray-800 max-w-16 focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              placeholder="1"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 px-6 text-white my-auto font-medium shadow-md transition-all hover:scale-105 cursor-pointer max-md:w-full max-md:py-2.5 mt-auto"
          >
            <img src={assets.searchIcon} alt="searchicon" className="h-5 invert" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-8 right-8 md:right-16 z-10 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              idx === currentSlide
                ? "w-8 bg-blue-400 shadow-lg"
                : "w-2.5 bg-white/50 hover:bg-white/90"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero; 