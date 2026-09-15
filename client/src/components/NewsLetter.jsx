import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");
    toast.success("Thank you for subscribing to StayZo!");
    setEmail("");
  };

  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-20">
      <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white px-8 md:px-16 py-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">

        <div className="max-w-xl">
          <p className="text-gray-300 text-sm font-medium">
            ⭐ Trusted by 15k+ Travelers
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400 text-lg">
              ★★★★★
            </span>

            <span className="text-gray-300 text-sm">
              4.9/5 • 2300+ Reviews
            </span>
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl font-playfair leading-tight">
            Join our Newsletter &
            <br />
            Stay Updated
          </h2>

          <p className="text-gray-400 mt-5">
            Get exclusive hotel deals, luxury travel tips and seasonal offers
            delivered directly to your inbox.
          </p>
        </div>

        {/* Right */}
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubscribe} className="bg-white rounded-full p-2 flex items-center shadow-lg">

            <span className="ml-4 text-gray-500">✉️</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 outline-none text-gray-700 text-sm"
              required
            />

            <button type="submit" className="bg-black hover:bg-gray-800 transition text-white px-8 py-2.5 rounded-full font-medium text-sm cursor-pointer">
              Subscribe
            </button>

          </form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            No spam. Only exclusive hotel offers and travel inspiration.
          </p>
        </div>

      </div>
    </section>
  );
};

export default NewsLetter;