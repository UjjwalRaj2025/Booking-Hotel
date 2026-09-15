import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: "Luxury Hotels", value: "500+" },
    { label: "Happy Guests", value: "120,000+" },
    { label: "Global Destinations", value: "45+" },
    { label: "Guest Satisfaction", value: "4.9 / 5.0" },
  ];

  const coreValues = [
    {
      title: "Unmatched Hospitality",
      description: "We curate properties that deliver warm, intuitive service and world-class luxury at every touchpoint.",
      icon: assets.badgeIcon,
    },
    {
      title: "Best Rate Guarantee",
      description: "Book directly through our platform for exclusive prices, complimentary upgrades, and zero hidden fees.",
      icon: assets.starIconFilled,
    },
    {
      title: "Seamless Reservations",
      description: "Enjoy instant real-time confirmation, flexible check-ins, and hassle-free booking management.",
      icon: assets.calenderIcon,
    },
    {
      title: "24/7 Dedicated Support",
      description: "Our dedicated concierge and travel advisors are available around the clock to assist your every need.",
      icon: assets.userIcon,
    },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 space-y-20">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Title
          title="About StaYzo"
          subTitle="Elevating how modern travelers discover, experience, and reserve handpicked luxury accommodations around the world."
          align="center"
        />
      </div>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
        <img
          src={assets.aboutHero}
          alt="Luxury Resort Lobby"
          className="w-full h-[380px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-12 text-white">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white font-bold uppercase tracking-widest text-xs md:text-sm mb-3 shadow-md">
              The Pinnacle of Travel
            </span>
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
            Where Exceptional Architecture Meets Unrivaled Comfort
          </h2>
          <p className="text-gray-200 text-sm md:text-base mt-3 max-w-xl font-light">
            Step into extraordinary spaces designed to inspire. From oceanfront sanctuaries to iconic urban retreats, every destination is chosen with perfection in mind.
          </p>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-8 md:p-10 rounded-2xl border border-blue-100/60 shadow-sm">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center space-y-1">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-outfit">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mission & Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-gray-700">
          <div>
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-bold tracking-widest uppercase text-sm md:text-base border border-blue-200/80 shadow-sm">
              Our Journey
            </span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl text-gray-900 leading-snug">
            Crafting Unforgettable Stay Experiences Since Day One
          </h2>
          <p className="text-base font-light leading-relaxed">
            Founded with a vision to redefine hospitality booking, StaYzo connects discerning travelers with extraordinary hotels, luxury villas, and boutique resorts across the globe.
          </p>
          <p className="text-base font-light leading-relaxed">
            We believe that a hotel is more than just a room to sleep in—it is the heart of your journey. That’s why we partner exclusively with verified properties that meet our stringent standards for elegance, safety, and pristine service.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {coreValues.map((value, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <img src={value.icon} alt={value.title} className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                  {value.title}
                </h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold">
            Ready to Begin Your Next Journey?
          </h2>
          <p className="text-gray-300 font-light text-sm md:text-base">
            Discover handpicked hotels, seamless booking, and exclusive rates crafted just for you.
          </p>
          <div className="pt-4">
            <Link
              to="/rooms"
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all shadow-md hover:scale-105"
            >
              Explore Available Rooms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
