const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("order_id");

if (!orderId) {
  document.getElementById("statusMessage").innerText = "Invalid order ID.";
} else {
  checkPaymentStatus(orderId);
}

async function checkPaymentStatus(orderId) {
  try {
    const token = localStorage.getItem("access_token"); // Get stored token

    const response = await axios.get(
      `http://localhost:4000/payment/payment-status?orderId=${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const status = response.data.orderStatus;
    document.getElementById(
      "statusMessage"
    ).innerText = `Your payment status: ${status}`;

    // If payment is successful, update UI to reflect premium status
    if (status === "SUCCESSFUL") {
      alert("Congratulations! You are now a premium user.");
      localStorage.setItem("userRole", "premium"); // Store premium status locally
    }
  } catch (err) {
    console.error("Error fetching payment status:", err.message);
    document.getElementById("statusMessage").innerText =
      "Error fetching payment status.";
  }
}
