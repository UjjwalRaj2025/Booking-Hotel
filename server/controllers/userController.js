

export const getUserData = async(req, res)=>{
  try {
    const userId = req.user?._id || req.auth?.userId;
    let user = req.user || (await User.findById(userId));
    
    // Check if user owns any hotel in MongoDB
    const hotel = await Hotel.findOne({ owner: userId });
    const isOwner = Boolean(hotel || (user && user.role === "hotelOwner"));

    if (hotel && user && user.role !== "hotelOwner") {
      user.role = "hotelOwner";
      await User.findByIdAndUpdate(userId, { role: "hotelOwner" });
    }

    res.json({
      success: true,
      role: user ? user.role : (isOwner ? "hotelOwner" : "user"),
      isOwner,
      recentSearchedCities: user ? user.recentSearchedCities : [],
      hotel
    });

  } catch(error){
    res.json({success: false, message: error.message});
  }
}

//store user recentr searched Cities
export const storeRecentSearchedCities = async (req, res)=>{
  try{
    const {recentSearchedCity} = req.body;
    const user = req.user;

    if(user.recentSearchedCities.length < 3 ){
      user.recentSearchedCities.push(recentSearchedCity)
    }else{
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity)
    }
    await user.save();
    res.json({success: true, message: "City added"})
  } catch(error){
    res.json({success: false, message: error.message})
  }
}

// sync user from Clerk to MongoDB
export const syncUser = async (req, res) => {
  try {
    const { userId, username, email, image } = req.body;
    await User.findByIdAndUpdate(
      userId,
      { _id: userId, username, email, image },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: "User synced successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};