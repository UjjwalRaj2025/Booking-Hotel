import React from "react";
import Title from "./Title";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";

const Testimonial = () => {
  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50">
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers choose QuickStay for their luxury accommodations around the world."
      />

      <div className="flex flex-wrap justify-center gap-8 pt-20">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="w-80 bg-white border border-gray-200 rounded-xl shadow-md pb-6"
          >
            {/* Top */}
            <div className="relative flex flex-col items-center px-5 py-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full absolute -top-12 border-4 border-white object-cover"
              />

              <div className="pt-14 text-center">
                <h2 className="text-xl font-playfair">
                  {testimonial.name}
                </h2>

                <p className="text-gray-500">
                  {testimonial.address}
                </p>
              </div>
            </div>

            {/* Review */}
            <p className="text-center text-gray-500 px-6 mt-2">
              "{testimonial.review}"
            </p>

            {/* Stars */}
            <div className="flex justify-center mt-5">
              <StarRating rating={testimonial.rating} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;