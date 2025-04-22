const Expense = require("../models/Expense");
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
    });

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
    const expenses = await Expense.findAll();

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
    const { id } = req.params;
    const expense = await Expense.destroy({ where: { id } });
    if (!expense) {
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
