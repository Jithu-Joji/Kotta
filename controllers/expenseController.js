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
  
      console.log('Expense created:', newExpense);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error.message);
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.clearExpensesForUser = async (req, res) => {
    const userId = req.params.userId;
    const { option } = req.body;
    console.log('Received user:', userId);
    console.log('Received option:', option);
  
    try {
      let deletedExpenses;
  
      switch (option) {
        case 'previousMonths':
          // Logic to clear expenses for previous months
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
  
          deletedExpenses = await Expense.deleteMany({
            user: userId,
            $or: [
              { $expr: { $ne: [{ $year: '$date' }, currentYear] } },
              {
                $and: [
                  { $expr: { $eq: [{ $year: '$date' }, currentYear] } },
                  { $expr: { $lt: [{ $month: '$date' }, currentMonth + 1] } },
                ],
              },
            ],
          });
          break;
  
        case 'previousWeeks':
          // Logic to clear expenses for the previous week (one week ago)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
          deletedExpenses = await Expense.deleteMany({
            user: userId,
            date: { $lt: oneWeekAgo },
          });
          break;
  
        case 'everything':
          // Logic to clear all expenses
          deletedExpenses = await Expense.deleteMany({ user: userId });
          break;
  
        default:
          break;
      }
  
      res.status(200).json({ message: 'Expenses cleared successfully', deletedExpenses });
    } catch (error) {
      console.error('Error clearing expenses:', error.message);
      res.status(500).json({ message: 'Error clearing expenses' });
    }
  };
  