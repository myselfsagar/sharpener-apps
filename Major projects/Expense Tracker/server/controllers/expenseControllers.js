const Expense = require("../models/Expense");
const User = require("../models/User");
const ExpenseFile = require("../models/ExpenseFile");
const sequelize = require("../config/dbConfig");
const s3 = require("../services/s3Service");

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

const downloadExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.userId } });
    if (!expenses.length) {
      return res.status(404).json({ error: "No expenses found!" });
    }
    let fileContent = "Id,Amount,Category,Description,Time\n";
    expenses.map((exp) => {
      fileContent += `${exp.id}, ${exp.amount}, ${exp.category}, ${exp.description}, ${exp.createdAt}\n`;
    });
    // fs.writeFileSync(filePath, fileContent);

    const fileName = `Expenses_${req.userId}_${new Date()}.csv`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: "public-read",
      ContentType: "text/csv",
    };

    const uploadResult = await s3.upload(uploadParams).promise();

    //Update in the Download history table
    await ExpenseFile.create({
      userId: req.userId,
      fileUrl: uploadResult.Location,
      fileName,
    });

    res.json({
      success: true,
      fileUrl: uploadResult.Location,
    });
  } catch (err) {
    console.error("Error generating expense report:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate report" });
  }
};

const getExpenseDownloads = async (req, res) => {
  try {
    const files = await ExpenseFile.findAll({
      where: { userId: req.userId },
      order: [["downloadedAt", "DESC"]],
    });

    res.json({ success: true, files });
  } catch (err) {
    console.error("Error getting expense downloads:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to get expense downloads" });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenses,
  getExpenseDownloads,
};
