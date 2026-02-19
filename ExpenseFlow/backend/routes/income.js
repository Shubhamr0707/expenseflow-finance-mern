const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const { protect } = require('../middleware/auth');

// @route   POST /api/income
// @desc    Add new income
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

    const income = await Income.create({
      user: req.user._id,
      category,
      amount,
      description,
      date: date || Date.now()
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding income' });
  }
});

// @route   GET /api/income
// @desc    Get all income for logged-in user
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

    let incomeQuery = Income.find(query);

    // Sort
    if (sort === 'amount-asc') {
      incomeQuery = incomeQuery.sort({ amount: 1 });
    } else if (sort === 'amount-desc') {
      incomeQuery = incomeQuery.sort({ amount: -1 });
    } else if (sort === 'date-asc') {
      incomeQuery = incomeQuery.sort({ date: 1 });
    } else {
      incomeQuery = incomeQuery.sort({ date: -1 }); // Default: newest first
    }

    const incomes = await incomeQuery;
    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching income' });
  }
});

// @route   GET /api/income/stats/summary
// @desc    Get income statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    
    const total = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    const categoryBreakdown = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {});

    res.json({
      total,
      count: incomes.length,
      categoryBreakdown
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/income/:id
// @desc    Get single income
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this income' });
    }

    res.json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching income' });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this income' });
    }

    const { category, amount, description, date } = req.body;

    income.category = category || income.category;
    income.amount = amount || income.amount;
    income.description = description || income.description;
    income.date = date || income.date;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating income' });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this income' });
    }

    await income.deleteOne();
    res.json({ message: 'Income removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting income' });
  }
});

module.exports = router;
