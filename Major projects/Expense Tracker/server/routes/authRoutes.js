const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.post("/signup", authControllers.signupController);
router.post("/login", authControllers.loginController);

module.exports = router;
