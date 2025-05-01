const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../config/dbConfig");

const addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  //check if all fields are entered
  if (!amount || !description || !category) {
    return res.status(400).json({ Error: "All fields are mandatory" });
  }

  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.create(
      { amount, description, category, userId: req.userId },
      { transaction }
    );

    //update the totalExpense in user table
    await User.increment("totalExpense", {
      by: amount,
      where: { id: req.userId },
      transaction,
    });

    await transaction.commit();
    res.status(201).json(expense);
  } catch (err) {
    await transaction.rollback();
    console.log("Error while adding expense", err);
    return res
      .status(500)
      .json({ Error: `Error while adding expense - ${err.message}` });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: req.userId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: {
        expenses,
        pagination: {
          totalRecords: count,
          totalPages,
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          pages: [...Array(totalPages).keys()].map((i) => i + 1),
        },
      },
    });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: err.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();

    const expenseId = req.params.id;
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.userId },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ Error: "Expense not found" });
    }

    await Expense.destroy({ where: { id: expenseId }, transaction });
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: req.userId },
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ Message: "Expense deleted successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error while deleting expense:", err);
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
