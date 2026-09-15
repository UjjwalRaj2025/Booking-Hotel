import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { FaTrash } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomName: "",
    roomType: "",
    pricePerNight: "",
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inputs.roomType || !inputs.pricePerNight) {
        return toast.error("Please fill in room type and price");
      }
      const selectedAmenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      const formData = new FormData();
      formData.append("roomName", inputs.roomName);
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);
      formData.append("amenities", JSON.stringify(selectedAmenities));

      Object.keys(images).forEach((key) => {
        if (images[key]) {
          formData.append("images", images[key]);
        }
      });

      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post("/api/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message || "Room added successfully");
        setInputs({
          roomName: "",
          roomType: "",
          pricePerNight: "",
          amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and provide accurate room details, pricing and amenities to enhance the user booking experience."
      />

      {/* Images */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Room Images
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Object.keys(images).map((key) => (
            <div key={key} className="relative group">

              <label
                htmlFor={`roomImage${key}`}
                className="cursor-pointer block"
              >
                <div className="h-36 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden hover:border-blue-500 transition duration-300 bg-gray-50">

                  <img
                    src={
                      images[key]
                        ? URL.createObjectURL(images[key])
                        : assets.uploadArea
                    }
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                </div>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id={`roomImage${key}`}
                  onChange={(e) =>
                    setImages({
                      ...images,
                      [key]: e.target.files[0],
                    })
                  }
                />
              </label>

              {/* Delete Button */}

              {images[key] && (
                <button
                  type="button"
                  onClick={() =>
                    setImages({
                      ...images,
                      [key]: null,
                    })
                  }
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  <FaTrash size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Room Name, Room Type & Price */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Room Name / No
          </label>
          <input
            type="text"
            placeholder="e.g. Deluxe Suite 101"
            value={inputs.roomName}
            onChange={(e) =>
              setInputs({
                ...inputs,
                roomName: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Room Type
          </label>

          <select
            value={inputs.roomType}
            onChange={(e) =>
              setInputs({
                ...inputs,
                roomType: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price
            <span className="text-gray-500 text-sm"> /night</span>
          </label>

          <input
            type="number"
            placeholder="0"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({
                ...inputs,
                pricePerNight: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Amenities */}

      <div className="mt-10">

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Amenities
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {Object.keys(inputs.amenities).map((amenity, index) => (
            <label
              key={index}
              htmlFor={`amenities${index + 1}`}
              className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-500 cursor-pointer transition"
            >
              <input
                type="checkbox"
                id={`amenities${index + 1}`}
                checked={inputs.amenities[amenity]}
                onChange={() =>
                  setInputs({
                    ...inputs,
                    amenities: {
                      ...inputs.amenities,
                      [amenity]: !inputs.amenities[amenity],
                    },
                  })
                }
                className="w-4 h-4 accent-blue-600"
              />

              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Button */}

      <div className="mt-10">

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl shadow-md hover:shadow-xl transition duration-300 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Room"}
        </button>

      </div>

    </form>
  );
};

export default AddRoom;