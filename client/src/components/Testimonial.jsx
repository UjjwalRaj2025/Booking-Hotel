import React, { useState, useEffect } from "react";
import Title from "./Title";
import StarRating from "./StarRating";
import WriteReviewModal from "./WriteReviewModal";
import { useAppContext } from "../context/AppContext";
import { useClerk } from "@clerk/react";
import { testimonials as dummyTestimonials } from "../assets/assets";

const Testimonial = () => {
  const { axios, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [reviewsList, setReviewsList] = useState(dummyTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/reviews/all");
      if (data.success && data.reviews && data.reviews.length > 0) {
        setReviewsList(data.reviews.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleWriteReviewClick = () => {
    if (!user) {
      return openSignIn();
    }
    setIsModalOpen(true);
  };

  const handleReviewAdded = (newReview) => {
    setReviewsList((prev) => [newReview, ...prev].slice(0, 5));
  };

  return (
    <section id="experience" className="py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50 relative scroll-mt-20">
      <div className="flex flex-col items-center">
        <Title
          title="What Our Guests Say"
          subTitle="Discover why discerning travelers choose StaYzo for their luxury accommodations around the world."
        />

        <button
          onClick={handleWriteReviewClick}
          className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <span>✍️</span> Write a Review
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pt-20">
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-12">
            Loading guest reviews...
          </div>
        ) : (
          reviewsList.map((testimonial, idx) => {
            const avatarUrl =
              testimonial.userImage ||
              testimonial.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                testimonial.name || "Guest"
              )}&background=0D8ABC&color=fff`;

            return (
              <div
                key={testimonial._id || testimonial.id || idx}
                className="w-80 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 pb-6 pt-2 flex flex-col justify-between"
              >
                {/* Top */}
                <div className="relative flex flex-col items-center px-5 py-4">
                  <img
                    src={avatarUrl}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full absolute -top-10 border-4 border-white object-cover shadow-md bg-gray-100"
                  />

                  <div className="pt-12 text-center">
                    <h2 className="text-lg font-bold font-playfair text-gray-900">
                      {testimonial.name}
                    </h2>

                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {testimonial.city || testimonial.address || "Verified Guest"}
                    </p>
                  </div>
                </div>

                {/* Review */}
                <p className="text-center text-gray-600 text-sm px-6 mt-1 italic font-light line-clamp-4">
                  "{testimonial.review}"
                </p>

                {/* Stars */}
                <div className="flex justify-center mt-5">
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />
    </section>
  );
};

export default Testimonial;