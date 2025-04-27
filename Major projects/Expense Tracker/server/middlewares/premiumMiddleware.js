const User = require("../models/User");

const premiumMiddleware = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).json({ Error: "User not found" });

    if (user.role !== "premium") {
      return res
        .status(403)
        .json({ Error: "Access denied: Premium users only" });
    }

    next();
  } catch (err) {
    console.error("Error in premiumMiddleware:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
};

module.exports = premiumMiddleware;
