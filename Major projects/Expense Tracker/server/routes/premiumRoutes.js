const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const premiumMiddleware = require("../middlewares/premiumMiddleware");
const premiumController = require("../controllers/premiumController");

const router = express.Router();

router.get(
  "/showLeaderboard",
  authMiddleware,
  premiumMiddleware,
  premiumController.getLeaderboard
);

module.exports = router;
