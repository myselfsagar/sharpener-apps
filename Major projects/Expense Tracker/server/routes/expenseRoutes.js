const router = require("express").Router();
const expenseControllers = require("../controllers/expenseControllers");
const verifyUser = require("../middlewares/verifyUser");

router.post("/add-expense", verifyUser, expenseControllers.addExpense);
router.get("/get-all-expenses", verifyUser, expenseControllers.getAllExpenses);
router.delete(
  "/delete-expense/:id",
  verifyUser,
  expenseControllers.deleteExpense
);

module.exports = router;
