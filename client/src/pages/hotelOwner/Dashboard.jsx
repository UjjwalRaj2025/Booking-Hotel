import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAuth } from "@clerk/react";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { currency, toast } = useAppContext();
  const [dashboardData, setDashBoardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/bookings/hotel`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data.success && data.dashboardData) {
          setDashBoardData(data.dashboardData);
        } else if (data.message) {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch hotel dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [getToken]);

  const getGuestName = (user) => {
    if (!user) return "Guest User";
    if (typeof user === "object") {
      return user.username || user.name || (user.email ? user.email.split("@")[0] : "Guest User");
    }
    return "Guest User";
  };

  const getRoomName = (room) => {
    if (!room) return "Standard Room";
    if (typeof room === "object") {
      return room.roomName || room.roomType || "Standard Room";
    }
    return "Standard Room";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-8">
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings, and analyze revenue all in one place. Stay updated with real-time insights for seamless hotel management."
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Bookings */}
        <div className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">
              Total Bookings
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              {dashboardData.totalBookings}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Successful reservations
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md group-hover:scale-110 transition">
            <img
              src={assets.totalBookingIcon}
              alt=""
              className="h-10 w-10"
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="group bg-gradient-to-r from-green-50 to-emerald-100 border border-green-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-sm text-green-600 font-medium uppercase tracking-wide">
              Total Revenue
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              {currency}{dashboardData.totalRevenue}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Lifetime earnings
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md group-hover:scale-110 transition">
            <img
              src={assets.totalRevenueIcon}
              alt=""
              className="h-10 w-10"
            />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Bookings
          </h2>

          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            {dashboardData.bookings.length} {dashboardData.bookings.length === 1 ? "Booking" : "Bookings"}
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              Loading real-time dashboard data...
            </div>
          ) : dashboardData.bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No bookings received yet. Your room listings are ready for guests!
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Guest
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 max-sm:hidden">
                    Room
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">
                    Dates
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboardData.bookings.map((item, index) => {
                  const guestName = getGuestName(item.user);
                  const roomName = getRoomName(item.room);
                  const status = item.status || "confirmed";
                  const isConfirmed = status.toLowerCase() === "confirmed" || item.isPaid;

                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-blue-50/50 transition-all border-b border-gray-100"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow">
                            {guestName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {guestName}
                            </span>
                            {item.guests && (
                              <span className="text-xs text-gray-500">
                                {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-700 font-medium max-sm:hidden">
                        {roomName}
                      </td>

                      <td className="px-6 py-5 text-center text-xs text-gray-600">
                        <div>{formatDate(item.checkInDate)}</div>
                        <div className="text-gray-400">to {formatDate(item.checkOutDate)}</div>
                      </td>

                      <td className="px-6 py-5 text-center font-bold text-gray-800">
                        {currency}{item.totalPrice}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            isConfirmed
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-1.5 ${
                              isConfirmed ? "bg-green-600" : "bg-yellow-500"
                            }`}
                          ></span>
                          {isConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;