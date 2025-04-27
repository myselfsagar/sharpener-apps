const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).json({ Error: "User not found" });

    const userData = user.toJSON(); // Convert instance to plain object
    delete userData.password; // Remove password before sending response

    return res.status(200).json(userData);
  } catch (err) {
    console.error("Error while fetching user", err);
    return res
      .status(500)
      .json({ Error: `Error while fetching user - ${err.message}` });
  }
};

module.exports = {
  getUserProfile,
};
