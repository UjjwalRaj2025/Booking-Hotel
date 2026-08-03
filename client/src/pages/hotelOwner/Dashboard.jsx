import React, { useState } from "react";
import Title from "../../components/Title";
import { assets, dashboardDummyData } from "../../assets/assets";

const Dashboard = () => {
  const [dashboardData, setDashBoardData] = useState(dashboardDummyData);

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
              ${dashboardData.totalRevenue}
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

          <span className="text-sm text-gray-500">
            {dashboardData.bookings.length} Bookings
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">

          <table className="w-full">

            <thead className="sticky top-0 bg-gray-50 z-10">

              <tr>

                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Guest
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-700 max-sm:hidden">
                  Room
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

              {dashboardData.bookings.map((item, index) => (

                <tr
                  key={index}
                  className="hover:bg-blue-50 transition-all border-t border-gray-100"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {item.user.username.charAt(0).toUpperCase()}
                      </div>

                      <span className="font-medium text-gray-800">
                        {item.user.username}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-gray-600 max-sm:hidden">
                    {item.room.roomType}
                  </td>

                  <td className="px-6 py-5 text-center font-semibold text-gray-800">
                    ${item.totalPrice}
                  </td>

                  <td className="px-6 py-5 text-center">

                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold ${
                        item.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          item.isPaid
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        }`}
                      ></span>

                      {item.isPaid ? "Completed" : "Pending"}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;