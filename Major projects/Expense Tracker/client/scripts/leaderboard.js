const SERVER_BASE_URL = "http://localhost:4000";

export async function showLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  const leaderboardList = document.getElementById("leaderboardList");

  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/premium/showleaderboard`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    console.log(response);

    leaderboardList.innerHTML = ""; // Clear old data

    response.data.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.user.name}: ₹${user.totalExpense}`;
      leaderboardList.appendChild(listItem);
    });

    leaderboardDiv.style.display = "block"; // ✅ Show leaderboard
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
  }
}
