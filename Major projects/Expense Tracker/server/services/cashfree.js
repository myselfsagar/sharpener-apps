const { Cashfree } = require("cashfree-pg");
const Order = require("../models/Order");

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = "SANDBOX";

const createOrder = async (orderAmount, customerPhone, customerId) => {
  try {
    const expiryDate = new Date(Date.now() + 15 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();
    const order_id = `order_${Date.now()}`; // Generate a unique order ID

    const request = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `http://127.0.0.1:5500/payment-status?order_id=${order_id}`,
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await Cashfree.PGCreateOrder("2025-01-01", request);

    if (response.data) {
      await Order.create({
        order_id,
        user_id: customerId,
        order_amount: orderAmount,
        payment_status: "PENDING",
      });

      return { payment_session_id: response.data.payment_session_id, order_id };
    } else {
      throw new Error("Invalid response from Cashfree");
    }
  } catch (err) {
    console.error("Error processing payment:", err.message);
    throw new Error(`Error creating order - ${err.message}`);
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments("2025-01-10", orderId);
    let getOrderResponse = response.data;

    let orderStatus;
    if (
      getOrderResponse.some(
        (transaction) => transaction.payment_status === "SUCCESS"
      )
    ) {
      orderStatus = "SUCCESSFUL";
    } else if (
      getOrderResponse.some(
        (transaction) => transaction.payment_status === "PENDING"
      )
    ) {
      orderStatus = "PENDING";
    } else {
      orderStatus = "FAILED";
    }

    // Update order status in DB
    await Order.update(
      { payment_status: orderStatus },
      { where: { order_id: orderId } }
    );

    return orderStatus;
  } catch (err) {
    console.error("Error fetching payment status:", err.message);
    throw new Error(`Error fetching payment status - ${err.message}`);
  }
};

module.exports = { createOrder, getPaymentStatus };
