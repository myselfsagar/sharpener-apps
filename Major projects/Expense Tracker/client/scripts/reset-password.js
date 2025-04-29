const SERVER_BASE_URL = "http://localhost:4000";

// Extract request ID from URL
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get("requestId");

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    try {
      await axios.post(`${SERVER_BASE_URL}/password/updatepassword`, {
        requestId,
        newPassword,
      });
      alert("Password updated! Try logging in.");
      window.location.href = "../pages/login.html";
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password.");
    }
  });
