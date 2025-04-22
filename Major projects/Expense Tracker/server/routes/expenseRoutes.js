const router = require("express").Router();
const expenseControllers = require("../controllers/expenseControllers");

router.post("/add-expense", expenseControllers.addExpense);
router.get("/get-all-expenses", expenseControllers.getAllExpenses);
router.delete("/delete-expense/:id", expenseControllers.deleteExpense);

module.exports = router;
