const cashfreeService = require("../services/cashfree");

const initiatePayment = async (req, res) => {
  try {
    const { orderAmount, customerPhone } = req.body;
    const customerId = req.userId; // Ensure this comes from authentication

    if (!orderAmount || !customerPhone || !customerId) {
      return res
        .status(400)
        .json({
          Error: "Order amount, customer phone, and user ID are required.",
        });
    }

    // Call the Cashfree service function to create an order
    const { payment_session_id, order_id } = await cashfreeService.createOrder(
      orderAmount,
      customerPhone,
      customerId
    );

    res.status(200).json({ payment_session_id, order_id });
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    res
      .status(500)
      .json({ Error: `Payment initiation failed - ${err.message}` });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ Error: "Order ID is required." });
    }

    const orderStatus = await cashfreeService.getPaymentStatus(orderId);

    // If payment is successful, upgrade the user to premium
    if (orderStatus === "SUCCESSFUL") {
      await User.update({ role: "premium" }, { where: { id: req.userId } });
    }

    res.status(200).json({ orderStatus });
  } catch (err) {
    console.error("Error fetching payment status:", err.message);
    res
      .status(500)
      .json({ Error: "Error updating payment status", details: err.message });
  }
};

module.exports = { initiatePayment, checkPaymentStatus };
