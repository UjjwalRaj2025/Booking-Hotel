import React from "react";
import { assets, exclusiveOffers } from "../assets/assets";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  const handleViewOffers = () => {
    navigate("/rooms");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">

     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button onClick={handleViewOffers} className="group flex items-center gap-2 mt-6 md:mt-0 text-sm font-medium hover:text-blue-600 cursor-pointer">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow"
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="relative rounded-xl bg-cover bg-center bg-no-repeat text-white p-6 min-h-[260px] flex flex-col justify-between shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-300" />
            <span className="relative z-10 top-2 left-2 w-fit bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
              {item.priceOff}% OFF
            </span>

            <div className="relative z-10 mt-10">
              <h3 className="text-2xl font-playfair">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-200">
                {item.description}
              </p>

              <p className="text-xs text-white/80 mt-4">
                Expires {item.expiryDate}
              </p>
            </div>

            <button onClick={handleViewOffers} className="relative z-10 group flex items-center gap-2 mt-6 text-sm font-medium cursor-pointer">
              View Offers
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="invert transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExclusiveOffers;