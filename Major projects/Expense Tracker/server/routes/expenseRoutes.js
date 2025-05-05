const router = require("express").Router();
const expenseControllers = require("../controllers/expenseControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-expense", authMiddleware, expenseControllers.addExpense);
router.get(
  "/get-all-expenses",
  authMiddleware,
  expenseControllers.getAllExpenses
);
router.delete(
  "/delete-expense/:id",
  authMiddleware,
  expenseControllers.deleteExpense
);
router.get(
  "/download-expenses",
  authMiddleware,
  expenseControllers.downloadExpenses
);
router.get(
  "/download-expense-history",
  authMiddleware,
  expenseControllers.getExpenseDownloads
);

module.exports = router;
