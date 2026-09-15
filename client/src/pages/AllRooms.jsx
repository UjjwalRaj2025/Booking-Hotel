import React, { useMemo, useState } from "react";
import { assets, facilityIcons, roomsDummyData, cities } from '../assets/assets';
import { useNavigate, useLocation } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <span className="font-light select-none text-gray-700">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <span className="font-light select-none text-gray-700">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms } = useAppContext();

  const searchParams = new URLSearchParams(location.search);
  const initialDestination = searchParams.get("destination") || "";

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState(initialDestination);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const SortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  // Handle filter changes
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type] = [...updatedFilters[type], value];
      } else {
        updatedFilters[type] = updatedFilters[type].filter((item) => item !== value);
      }
      return updatedFilters;
    });
  };

  // Handle sort change
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Clear all filters & search
  const handleClearFilters = () => {
    setSelectedFilters({ roomType: [], priceRange: [] });
    setSelectedSort("");
    setSearchQuery("");
    navigate("/rooms");
  };

  // Check if a room matches selected room types
  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType)
    );
  };

  // Check if room matches selected price range
  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;
    return selectedFilters.priceRange.some((range) => {
      const cleanRange = range.replace(/\$/g, "").trim();
      const [minStr, maxStr] = cleanRange.split(" to ");
      const min = Number(minStr);
      const max = Number(maxStr);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  // Check if room matches search query
  const matchesSearch = (room) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      room.hotel?.name?.toLowerCase().includes(q) ||
      room.hotel?.city?.toLowerCase().includes(q) ||
      room.hotel?.address?.toLowerCase().includes(q) ||
      room.roomType?.toLowerCase().includes(q)
    );
  };

  // Sort rooms
  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low to High") {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === "Price High to Low") {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === "Newest First") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0;
  };

  const allRoomsList = rooms.length > 0 ? rooms : roomsDummyData;

  // Filter & Sort Rooms
  const filteredRooms = useMemo(() => {
    return allRoomsList
      .filter(
        (room) =>
          matchesRoomType(room) &&
          matchesPriceRange(room) &&
          matchesSearch(room)
      )
      .sort(sortRooms);
  }, [allRoomsList, selectedFilters, selectedSort, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rooms?destination=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/rooms");
    }
  };

  return (
    <div className="pt-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="flex flex-col items-start text-left mb-6">
        <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
        <p className="text-sm md:text-base text-gray-500/90 mt-2">
          Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
        </p>
      </div>

      {/* Search Toolbar */}
      <form
        onSubmit={handleSearchSubmit}
        className="w-full bg-white shadow-md border border-gray-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4"
      >
        <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full">
          <img src={assets.searchIcon} alt="search" className="h-5 w-5 opacity-60" />
          <input
            list="destination-list"
            type="text"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, hotel name, or address..."
            className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          <datalist id="destination-list">
            {cities.map((city, idx) => (
              <option key={idx} value={city} />
            ))}
          </datalist>
        </div>

        <div className="flex items-center gap-3 max-md:w-full">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow transition duration-300 flex items-center justify-center gap-2 max-md:flex-1 cursor-pointer"
          >
            <img src={assets.searchIcon} alt="search" className="h-4 w-4 invert" />
            <span>Search</span>
          </button>

          {(searchQuery || selectedFilters.roomType.length > 0 || selectedFilters.priceRange.length > 0 || selectedSort) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition duration-300 cursor-pointer border border-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Main Layout: Rooms List + Sidebar Filters */}
      <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-8">
        {/* Rooms Listing */}
        <div className="flex-1 w-full">
          {filteredRooms.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center my-8">
              <p className="text-xl font-medium text-gray-700">No rooms found</p>
              <p className="text-gray-500 text-sm mt-2">
                We couldn't find any rooms matching your search criteria. Try adjusting or clearing your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl text-sm transition duration-300 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredRooms.map((room) => (
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
                  src={room.images?.[0]}
                  alt="hotel-img"
                  title="View Room Details"
                  className="w-full md:w-[45%] h-72 object-cover rounded-xl shadow-lg cursor-pointer hover:opacity-95 transition"
                />

                {/* Room Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mb-1">
                    <img src={assets.locationIcon} alt="city-icon" className="w-4 h-4 opacity-70" />
                    <span>{room.hotel?.city || room.city || "Puducherry"}</span>
                  </div>

                  <h2
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="font-playfair text-4xl text-gray-900 cursor-pointer mt-1 hover:text-blue-600 transition"
                  >
                    {room.hotel?.name}
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
                    <span>{room.hotel?.address}</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {Array.isArray(room.amenities) &&
                      room.amenities.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#F5F5FF]"
                        >
                          {facilityIcons[item] && (
                            <img
                              src={facilityIcons[item]}
                              alt={item}
                              className="w-5 h-5"
                            />
                          )}
                          <p className="text-sm text-gray-600">{item}</p>
                        </div>
                      ))}
                  </div>

                  {/* Rooms Price */}
                  <p className="text-xl font-medium text-gray-700 mt-4">
                    ${room.pricePerNight}/night
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Filters */}
        <div className="bg-white w-full lg:w-80 border border-gray-300 rounded-2xl text-gray-600 max-lg:mb-4 overflow-hidden shadow-sm">
          <div
            className={`flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50`}
          >
            <p className="text-base font-semibold text-gray-800">
              FILTERS
            </p>

            <div className="text-xs cursor-pointer">
              <span
                onClick={() => setOpenFilters(!openFilters)}
                className="lg:hidden font-medium text-blue-600"
              >
                {openFilters ? "HIDE" : "SHOW"}
              </span>

              <span
                onClick={handleClearFilters}
                className="hidden lg:block font-medium text-gray-500 hover:text-red-600 transition"
              >
                CLEAR
              </span>
            </div>
          </div>

          <div
            className={`${
              openFilters ? "h-auto" : "h-0 lg:h-auto"
            } overflow-hidden transition-all duration-500`}
          >
            {/* Room Types */}
            <div className="px-5 pt-5">
              <p className="font-semibold text-gray-800 pb-2">
                Room Types
              </p>
              {roomTypes.map((type, index) => (
                <CheckBox
                  key={index}
                  label={type}
                  selected={selectedFilters.roomType.includes(type)}
                  onChange={(checked, label) => handleFilterChange(checked, label, "roomType")}
                />
              ))}
            </div>

            {/* Price Range */}
            <div className="px-5 pt-5 border-t border-gray-100 mt-4">
              <p className="font-semibold text-gray-800 pb-2">
                Price Range
              </p>
              {priceRanges.map((range, index) => (
                <CheckBox
                  key={index}
                  label={`$ ${range}`}
                  selected={selectedFilters.priceRange.includes(`$ ${range}`)}
                  onChange={(checked, label) => handleFilterChange(checked, label, "priceRange")}
                />
              ))}
            </div>

            {/* Sort By */}
            <div className="px-5 pt-5 pb-7 border-t border-gray-100 mt-4">
              <p className="font-semibold text-gray-800 pb-2">
                Sort By
              </p>
              {SortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSort === option}
                  onChange={(label) => handleSortChange(label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
