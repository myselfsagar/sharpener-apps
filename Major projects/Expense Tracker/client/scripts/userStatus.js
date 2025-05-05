import { showLeaderboard } from "./leaderboard.js";

const SERVER_BASE_URL = "http://localhost:4000";

export async function userStatus() {
  const payButton = document.getElementById("payButton");
  const premiumMessage = document.getElementById("premiumMessage");
  const showLeaderboard = document.getElementById("showLeaderboard");
  const downloadExpense = document.getElementById("downloadExpense");
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
      showLeaderboard.style.display = "";
      downloadExpense.disabled = false;
      localStorage.setItem("user_role", "premium");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
}
