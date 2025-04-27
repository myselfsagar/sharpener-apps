const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../config/dbConfig");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Expense.findAll({
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalExpense"],
      ],
      include: [{ model: User, attributes: ["name"] }],
      group: ["userId"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
    });

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ Error: "Failed to retrieve leaderboard." });
  }
};

module.exports = { getLeaderboard };
