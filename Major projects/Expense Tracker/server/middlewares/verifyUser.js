const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyUser = async (req, res, next) => {
  try {
    // Check if token exists and starts with "Bearer"
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ Error: "Unauthorized: No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    req.userId = decoded.userId;

    // Check if user exists
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }

    next();
  } catch (err) {
    console.log("JWT Error:", err);
    return res.status(401).json({ Error: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyUser;
