const SERVER_BASE_URL = "http://localhost:4000"; // Update with your actual backend URL
const token = localStorage.getItem("access_token");

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  if (orderId) {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/payment/payment-status/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderAmount, orderStatus } = response.data;

      document.getElementById(
        "orderAmount"
      ).textContent = `Order Amount: ${orderAmount} INR`;
      document.getElementById("orderId").textContent = `Order ID: ${orderId}`;
      document.getElementById("status").textContent = `Status: ${orderStatus}`;

      setTimeout(() => {
        window.location.href = `${process.env.CLIENT_BASE_URL}/index.html`;
      }, 5000);
    } catch (err) {
      console.error("Error fetching payment status:", err.message);
      document.getElementById("status").textContent =
        "Error fetching payment status.";
    }
  } else {
    document.getElementById("status").textContent = "Invalid Order ID.";
  }
});
