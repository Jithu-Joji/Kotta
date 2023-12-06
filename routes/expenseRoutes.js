// routes/expenseRoutes.js

const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Fetch all expenses for a specific user
router.get('/:userId/fetch', expenseController.getExpensesForUser);

// Create a new expense for a specific user
router.post('/:userId/submit', expenseController.createExpense);

module.exports = router;
