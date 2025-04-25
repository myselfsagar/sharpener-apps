const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  initiatePayment,
  checkPaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", authMiddleware, initiatePayment); // Initiates payment
router.get("/payment-status", authMiddleware, checkPaymentStatus); // Fetches payment status

module.exports = router;
