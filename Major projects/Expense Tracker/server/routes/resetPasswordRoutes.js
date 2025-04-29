const router = require("express").Router();
const resetPasswordControllers = require("../controllers/resetPasswordControllers");

router.post("/forgotPassword", resetPasswordControllers.forgotPassword);

module.exports = router;
