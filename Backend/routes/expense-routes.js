const express = require("express");
const {
  addExpense,
  expenses,
  expense,
  updatePaymentStatus,
  getGroupExpenses,
  userExpenses,
} = require("../controllers/expense-controller");
const authMiddleware = require("../middleware/authMiddleware");

const expenseRouter = express.Router();

expenseRouter.use(authMiddleware); 

expenseRouter.post("/addExpense", addExpense);

expenseRouter.get("/expenses/:userId", expenses);

expenseRouter.get("/expense/:expenseId", expense);

expenseRouter.post("/paymentStatus", updatePaymentStatus);

expenseRouter.get("/groupExpenses/:groupId", getGroupExpenses);

expenseRouter.get("/userExpenses/:userId/:friendId", userExpenses);

module.exports = expenseRouter;




