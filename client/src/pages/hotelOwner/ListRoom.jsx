import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ListRoom = () => {
  const { axios, getToken, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && data.rooms) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error("Failed to fetch owner rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (roomId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/rooms/toggle-availibility",
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setRooms((prev) =>
          prev.map((r) =>
            r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
      <Title
        align="left"
        font="outfit"
        title="Room Listing & Booking Status"
        subTitle="View, edit or manage all listed rooms. Track real-time reservation status and toggle room availability for guest bookings."
      />

      <div className="flex items-center justify-between mt-8 mb-2">
        <p className="text-gray-800 font-bold text-lg">All Rooms</p>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"}
        </span>
      </div>

      <div className="w-full border border-gray-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Loading listed rooms & booking status...
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No rooms listed yet. Click "Add Room" to create your first listing!
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-5 text-gray-700 font-semibold">
                  Room Name / No
                </th>

                <th className="py-4 px-5 text-gray-700 font-semibold max-sm:hidden">
                  Facilities
                </th>

                <th className="py-4 px-5 text-gray-700 font-semibold">
                  Price / Night
                </th>

                <th className="py-4 px-5 text-gray-700 font-semibold text-center">
                  Reservation Status
                </th>

                <th className="py-4 px-5 text-gray-700 font-semibold text-center">
                  Listing Active
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {rooms.map((item) => {
                const roomTitle = item.roomName || item.roomType || item.name || "Standard Room";
                const activeBooking = item.currentBooking || item.latestBooking;
                const isBooked = item.isCurrentlyBooked || Boolean(activeBooking);

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50/40 transition-colors border-b border-gray-100"
                  >
                    <td className="py-4 px-5 text-gray-800 font-semibold">
                      <div>{roomTitle}</div>
                      {item.roomType && item.roomName && (
                        <div className="text-xs text-gray-400 font-normal">{item.roomType}</div>
                      )}
                    </td>

                    <td className="py-4 px-5 text-gray-600 max-sm:hidden text-xs">
                      {Array.isArray(item.amenities) ? item.amenities.join(", ") : item.amenities}
                    </td>

                    <td className="py-4 px-5 text-gray-800 font-bold">
                      {currency}{item.pricePerNight}
                    </td>

                    {/* Reservation Status Badge */}
                    <td className="py-4 px-5 text-center">
                      {isBooked ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse"></span>
                            Booked / Reserved
                          </span>
                          {activeBooking && (
                            <span className="text-[11px] text-gray-500 mt-1 font-medium">
                              {formatDate(activeBooking.checkInDate)} – {formatDate(activeBooking.checkOutDate)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></span>
                          Vacant / Ready
                        </span>
                      )}
                    </td>

                    {/* Listing Active Toggle */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex flex-col items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.isAvailable}
                            onChange={() => toggleAvailability(item._id)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-600"></div>
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow"></span>
                        </label>
                        <span className="text-[11px] text-gray-400 mt-1">
                          {item.isAvailable ? "Listed" : "Unlisted"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListRoom;