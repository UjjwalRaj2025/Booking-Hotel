import React, { useState } from "react";
import { roomsDummyData } from "../../assets/assets";
import Title from "../../components/Title";

const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <Title
        align="left"
        font="outfit"
        title="Room Listing"
        subTitle="View, edit or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-600 font-medium mt-8 mb-3">All Rooms</p>

      <div className="w-full max-w-4xl border border-gray-300 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="py-4 px-4 text-gray-800 font-semibold">
                Name
              </th>

              <th className="py-4 px-4 text-gray-800 font-semibold max-sm:hidden">
                Facility
              </th>

              <th className="py-4 px-4 text-gray-800 font-semibold">
                Price / Night
              </th>

              <th className="py-4 px-4 text-gray-800 font-semibold text-center">
                Availability
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 border-t border-gray-200 text-gray-700">
                  {item.roomType}
                </td>

                <td className="py-4 px-4 border-t border-gray-200 text-gray-600 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>

                <td className="py-4 px-4 border-t border-gray-200 text-gray-700 font-medium">
                  ₹{item.pricePerNight}
                </td>

                <td className="py-4 px-4 border-t border-gray-200 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      readOnly
                    />

                    <div className="w-12 h-7 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-600"></div>

                    <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;