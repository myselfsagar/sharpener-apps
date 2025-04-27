const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-user-profile", authMiddleware, userControllers.getUserProfile);

module.exports = router;
