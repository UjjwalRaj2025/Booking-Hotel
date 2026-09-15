import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken, setIsOwner, fetchRooms } = useAppContext();
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchHotel = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success && data.hotel) {
                    setName(data.hotel.name || '');
                    setContact(data.hotel.contact || '');
                    setAddress(data.hotel.address || '');
                    setCity(data.hotel.city || '');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchHotel();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.post(`/api/hotels`, 
                { name, contact, address, city },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message || "Hotel & City Registered Successfully");
                setIsOwner(true);
                setShowHotelReg(false);
                if (fetchRooms) fetchRooms();
            } else {
                toast.error(data.message || "Registration Failed");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <div onClick={() => setShowHotelReg(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-page-entry">
            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="flex bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden shadow-xl">

                <img
                    src={assets.regImage}
                    alt="reg-image"
                    className="w-1/2 hidden md:block object-cover"
                />

                <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">

                    <img
                        onClick={() => setShowHotelReg(false)}
                        src={assets.closeIcon}
                        alt="close"
                        className="absolute top-4 right-4 h-4 w-4 cursor-pointer hover:scale-110 transition-transform"
                    />

                    <p className="text-2xl font-semibold mt-6">
                        Register Your Hotel
                    </p>

                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label htmlFor='name' className='font-medium text-gray-500'>Hotel Name</label>
                        <input 
                            id='name' 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name}
                            placeholder='Type here' 
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                            required 
                        />
                    </div>

                    {/* Phone */}
                    <div className='w-full mt-4'>
                        <label htmlFor='contact' className='font-medium text-gray-500'>Phone</label>
                        <input 
                            id='contact' 
                            type="text" 
                            onChange={(e) => setContact(e.target.value)}
                            value={contact}
                            placeholder='Type here' 
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                            required 
                        />
                    </div>

                    {/* Address */}
                    <div className='w-full mt-4'>
                        <label htmlFor='address' className='font-medium text-gray-500'>Address</label>
                        <input 
                            id='address' 
                            type="text" 
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            placeholder='Type here' 
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                            required 
                        />
                    </div>

                    {/* Select City */}
                    <div className="w-full mt-4 max-w-60 mr-auto">
                        <label htmlFor="city" className="font-medium text-gray-500">City</label>

                        <select
                            id="city"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                            className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-all duration-300 font-medium cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default HotelReg;