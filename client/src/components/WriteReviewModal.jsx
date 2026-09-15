import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const WriteReviewModal = ({ isOpen, onClose, onReviewAdded }) => {
  const { axios, getToken, user } = useAppContext();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [city, setCity] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock background page scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please log in to submit a review.");
    }
    if (!review || review.trim().length === 0) {
      return toast.error("Please enter your review text.");
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      const clerkName = 
        user.fullName || 
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
        user.username || 
        (user.primaryEmailAddress?.emailAddress ? user.primaryEmailAddress.emailAddress.split('@')[0] : "");
      const clerkImage = user.imageUrl || "";

      const { data } = await axios.post(
        "/api/reviews/add",
        { rating, review, city, name: clerkName, userImage: clerkImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Review submitted successfully!");
        if (onReviewAdded) onReviewAdded(data.review);
        setReview("");
        setCity("");
        setRating(5);
        onClose();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-y-auto transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 md:p-8 shadow-2xl relative border border-gray-100 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-1 pr-6">
          Share Your Experience
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm text-center mb-4 sm:mb-5">
          How was your stay with StaYzo? Leave a rating & review to help fellow travelers!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating Selector */}
          <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Your Overall Rating
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl sm:text-3xl focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                >
                  <span className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600">
              {rating === 5 && "Outstanding (5/5)"}
              {rating === 4 && "Very Good (4/5)"}
              {rating === 3 && "Average (3/5)"}
              {rating === 2 && "Poor (2/5)"}
              {rating === 1 && "Terrible (1/5)"}
            </span>
          </div>

          {/* City / Location Input */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Your City / Location
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Barcelona, Spain or New Delhi, India"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          {/* Review Text Area */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about the hotel, hospitality, booking experience..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl sm:rounded-2xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Submitting Review...
              </>
            ) : (
              "Post Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
