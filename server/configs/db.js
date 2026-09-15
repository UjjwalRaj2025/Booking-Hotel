import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ Database Connected to hotel-booking")
    );

    // Clean URI if base URL contains duplicated database path or params
    let uri = process.env.MONGODB_URI;
    if (uri.includes("/hotel-booking/hotel-booking")) {
      uri = uri.replace("/hotel-booking/hotel-booking", "/hotel-booking");
    }

    await mongoose.connect(uri, {
      dbName: "hotel-booking",
    });
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
  }
};

export default connectDB;