const router = require("express").Router();
const resetPasswordControllers = require("../controllers/resetPasswordControllers");

router.post("/forgotPassword", resetPasswordControllers.sendPasswordResetEmail);
router.get(
  "/resetPassword/:requestId",
  resetPasswordControllers.verifyResetRequest
);
router.post("/updatepassword", resetPasswordControllers.updatepassword);

module.exports = router;
