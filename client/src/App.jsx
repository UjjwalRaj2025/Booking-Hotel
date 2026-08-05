import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Route, Routes, useLocation} from 'react-router-dom'
import { useUser, useAuth } from '@clerk/react'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";


const App =() => {
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUserToDB = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const token = await getToken();
          const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
          await fetch(`${backendUrl}/api/user/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              username:
                user.fullName ||
                user.username ||
                user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
                "User",
              email: user.primaryEmailAddress?.emailAddress || "",
              image: user.imageUrl || "",
            }),
          });
        } catch (err) {
          console.error("Failed to sync user to MongoDB:", err);
        }
      }
    };

    syncUserToDB();
  }, [isLoaded, isSignedIn, user]);
  return(
    <div>
     {!isOwnerPath && <Navbar />}
    {false && <HotelReg/>}
     <div className='min-h-[70vh]'>
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/rooms" element={<AllRooms />} />
  <Route path="/rooms/:id" element={<RoomDetails />} />
  <Route path="/my-bookings" element={<MyBookings />} />

  {/* Owner Routes */}
  <Route path="/owner" element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="add-room" element={<AddRoom />} />
    <Route path="list-room" element={<ListRoom />} />
  </Route>
</Routes>
     
      
     </div>
{!isOwnerPath && <Footer />}    </div>
  )
}
export default App