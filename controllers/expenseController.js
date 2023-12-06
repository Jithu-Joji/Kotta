// controllers/expenseController.js

const Expense = require('../models/expenseModel');
const User = require('../models/userModel');

// Fetch all expenses
exports.getExpensesForUser = async (req, res) => {
    const userId = req.params.userId; 
  
    try {
      const expenses = await Expense.find({ user: userId });
      res.json({ expenses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.createExpense = async (req, res) => {
    const { title, amount, date } = req.body;
    const userId = req.params.userId;
  
    try {
      console.log('Received data:', req.body);
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newExpense = new Expense({ title, amount, date, user: user });
      await newExpense.save();
  
      console.log('Expense created:', newExpense); // Log the created expense
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error.message);
      res.status(400).json({ message: error.message });
    }
  };
  