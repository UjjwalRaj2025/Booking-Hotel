import React from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import {useNavigate} from 'react-router-dom';
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const {rooms, navigate} = useAppContext();
  



  return rooms.length > 0 &&(
    <section className="py-20 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      <div className="flex flex-wrap justify-center gap-8 mt-12">
        {rooms.slice(0, 10).map((room, index) => (
          <HotelCard
            key={room._id}
            room={room}
            index={index}
          />
        ))}
      </div>
  <div className="flex justify-center mt-16">
      <button onClick={() => {navigate("/rooms"); scrollTo(0, 0);}}
    className="px-4 py-2 text-sm font-medium border border-blue-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer">
    View All Destinations</button>
  </div>
      
      
    </section>
  );
};

export default FeaturedDestination;