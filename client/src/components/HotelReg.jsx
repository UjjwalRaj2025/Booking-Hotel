import React from 'react';
import { assets } from '../assets/assets';
import { cities } from "../assets/assets";

const HotelReg = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <form className="flex bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden shadow-xl">

                <img
                    src={assets.regImage}
                    alt="reg-image"
                    className="w-1/2 hidden md:block object-cover"
                />

                <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">

                    <img
                        src={assets.closeIcon}
                        alt="close"
                        className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
                    />

                    <p className="text-2xl font-semibold mt-6">
                        Register Your Hotel
                    </p>
                    {/* {HotelName} */}
                    <div className='w-full mt-4'>
                        <label htmlFor='name' className='font-medium text-gray-500'>Hotel Name</label>
                        <input id='name' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* phone */}
                    <div className='w-full mt-4'>
                        <label htmlFor='contact' className='font-medium text-gray-500'>Phone</label>
                        <input id='contact' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* address */}
                    <div className='w-full mt-4'>
                        <label htmlFor='address' className='font-medium text-gray-500'>Address</label>
                        <input id='address' type="text" placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>
                    {/* slect city drop down */}
                    <div className="w-full mt-4 max-w-60 mr-auto">
    <label
        htmlFor="city"
        className="font-medium text-gray-500"
    >
        City
    </label>

    <select
        id="city"
        className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
        required
    >
        <option value="">Select City</option>

        {cities.map((city) => (
            <option key={city} value={city}>
                {city}
            </option>
        ))}
    </select>
</div>
<button
  type="submit"
  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-all duration-300 font-medium cursor-pointer"
>
  Register
</button>                </div>

            </form>
        </div>
    );
};

export default HotelReg;