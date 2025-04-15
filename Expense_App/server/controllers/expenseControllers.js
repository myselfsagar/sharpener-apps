const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    if (!amount || !description || !category) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    const expense = await Expense.create({ amount, description, category });
    res.status(201).json(expense);
  } catch (err) {
    console.log("Error adding expense", err);
    res.status(500).json({ Error: `Error adding expense: ${err.message}` });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.log("Error fetching expenses", err);
    res.status(500).json({ Error: `Error fetching expenses: ${err.message}` });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    await Expense.destroy({ where: { id: expenseId } });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.log("Error deleting expense", err);
    res.status(500).json({ Error: `Error deleting expense: ${err.message}` });
  }
};

const editExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { amount, description, category } = req.body;
    const expense = await Expense.update(
      { amount, description, category },
      { where: { id: expenseId } }
    );
    res.json(expense);
  } catch (err) {
    console.log("Error editing expense", err);
    res.status(500).json({ Error: `Error editing expense: ${err.message}` });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense, editExpense };
