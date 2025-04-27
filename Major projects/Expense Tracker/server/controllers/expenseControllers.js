const Expense = require("../models/Expense");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  //check if all fields are entered
  if (!amount || !description || !category) {
    return res.status(400).json({ Error: "All fields are mandatory" });
  }

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.userId,
    });

    //update the totalExpense in user table
    const user = await User.findByPk(req.userId);
    user.totalExpense += amount;
    await user.save();

    res.status(201).json(expense);
  } catch (err) {
    console.log("Error while adding expense", err);
    return res
      .status(500)
      .json({ Error: `Error while adding expense - ${err.message}` });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.userId } });

    res.status(200).json(expenses);
  } catch (err) {
    console.log("Error while fetching expenses", err);
    return res
      .status(500)
      .json({ Error: `Error while fetching expenses - ${err.message}` });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.destroy({
      where: { id: expenseId, userId: req.userId },
    });
    if (expense === 0) {
      return res.status(404).json({ Error: "Expense not found" });
    }
    res.status(200).json({ Message: "Expense deleted successfully" });
  } catch (err) {
    console.log("Error while deleting expense", err);
    return res
      .status(500)
      .json({ Error: `Error while deleting expense - ${err.message}` });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
};
