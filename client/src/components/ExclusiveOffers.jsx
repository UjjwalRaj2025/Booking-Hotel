import React from "react";
import { assets, exclusiveOffers } from "../assets/assets";
import Title from "./Title";

const ExclusiveOffers = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">

     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button className="group flex items-center gap-2 mt-6 md:mt-0">
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
            className="relative rounded-xl bg-cover bg-center bg-no-repeat text-white p-6 min-h-[260px] flex flex-col justify-between"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <span className="absolute top-4 left-4 bg-white text-gray-800 text-xs px-3 py-1 rounded-full">
              {item.priceOff}% OFF
            </span>

            <div className="mt-10">
              <h3 className="text-2xl font-playfair">
                {item.title}
              </h3>

              <p className="mt-2">
                {item.description}
              </p>

              <p className="text-sm text-white/80 mt-4">
                Expires {item.expiryDate}
              </p>
            </div>

            <button className="group flex items-center gap-2 mt-6">
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