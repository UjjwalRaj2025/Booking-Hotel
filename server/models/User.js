import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    _id: { type: String,required: true},
    username: {type: String,default: "User"},
    email: {type: String,required: true,unique: true},
    image: {type: String,required: true},
    role: {type: String,enum: ["user", "hotelOwner"],default: "user"    },
    recentSearchedCities: {type:[String],default: []},
=======
    _id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },
    recentSearchedCities: {
      type: [String],
      default: [],
    },
>>>>>>> da006e5246d6b69e94669ba5dafcb573baaed78c
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;