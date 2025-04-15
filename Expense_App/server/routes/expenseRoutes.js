const router = require("express").Router();
const expenseControllers = require("../controllers/expenseControllers");

router.post("/", expenseControllers.addExpense);
router.get("/", expenseControllers.getAllExpenses);
router.delete("/:id", expenseControllers.deleteExpense);
router.put("/:id", expenseControllers.editExpense);

module.exports = router;
