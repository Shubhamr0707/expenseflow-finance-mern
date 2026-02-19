const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   POST /api/expense
// @desc    Add new expense
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    // Validation
    if (!category || !amount || !description) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      category,
      amount,
      description,
      date: date || Date.now()
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding expense' });
  }
});

// @route   GET /api/expense
// @desc    Get all expenses for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { sort, category, startDate, endDate } = req.query;
    
    let query = { user: req.user._id };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let expenseQuery = Expense.find(query);

    // Sort
    if (sort === 'amount-asc') {
      expenseQuery = expenseQuery.sort({ amount: 1 });
    } else if (sort === 'amount-desc') {
      expenseQuery = expenseQuery.sort({ amount: -1 });
    } else if (sort === 'date-asc') {
      expenseQuery = expenseQuery.sort({ date: 1 });
    } else {
      expenseQuery = expenseQuery.sort({ date: -1 }); // Default: newest first
    }

    const expenses = await expenseQuery;
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// @route   GET /api/expense/stats/summary
// @desc    Get expense statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    res.json({
      total,
      count: expenses.length,
      categoryBreakdown
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/expense/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching expense' });
  }
});

// @route   PUT /api/expense/:id
// @desc    Update expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    const { category, amount, description, date } = req.body;

    expense.category = category || expense.category;
    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
});

// @route   DELETE /api/expense/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
});

module.exports = router;
