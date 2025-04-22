const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.post("/signup", authControllers.signupController);

module.exports = router;
