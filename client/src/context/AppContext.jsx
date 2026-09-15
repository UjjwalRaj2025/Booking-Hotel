import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(() => localStorage.getItem("isOwner") === "true");
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
 
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Extract full name / display name from Clerk user object
      const clerkName = 
        user.fullName || 
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
        user.username || 
        (user.primaryEmailAddress?.emailAddress ? user.primaryEmailAddress.emailAddress.split('@')[0] : "");
      
      const clerkEmail = user.primaryEmailAddress?.emailAddress || "";
      const clerkImage = user.imageUrl || "";

      // Sync user profile to backend
      if (clerkName || clerkEmail) {
        await axios.post(
          "/api/user/sync",
          {
            userId: user.id,
            username: clerkName,
            email: clerkEmail,
            image: clerkImage,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).catch(() => {});
      }

      const { data } = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const ownerStatus = Boolean(data.isOwner || data.role === "hotelOwner" || data.hotel);
        setIsOwner(ownerStatus);
        localStorage.setItem("isOwner", ownerStatus ? "true" : "false");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      console.error("fetchUser error:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      setIsOwner(false);
      localStorage.removeItem("isOwner");
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
