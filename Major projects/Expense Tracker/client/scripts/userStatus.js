import { showLeaderboard } from "./leaderboard.js";

const SERVER_BASE_URL = "http://localhost:4000";

const userStatus = document.addEventListener("DOMContentLoaded", async () => {
  const payButton = document.getElementById("payButton");
  const premiumMessage = document.getElementById("premiumMessage");
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.replace("../pages/login.html");
    return;
  }

  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/user/get-user-profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.role === "premium") {
      payButton.style.display = "none";
      premiumMessage.style.display = "block";
      showLeaderboard();
      localStorage.setItem("user_role", "premium");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
});

export default userStatus;
