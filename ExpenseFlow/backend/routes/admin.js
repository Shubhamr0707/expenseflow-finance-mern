const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    
    // Also delete user's income, expenses, and contacts
    await Income.deleteMany({ user: req.params.id });
    await Expense.deleteMany({ user: req.params.id });
    await Contact.deleteMany({ user: req.params.id });

    res.json({ message: 'User and associated data removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact messages
// @access  Private/Admin
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching contacts' });
  }
});

// @route   PUT /api/admin/contacts/:id
// @desc    Update contact status
// @access  Private/Admin
router.put('/contacts/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    contact.status = req.body.status || contact.status;
    const updatedContact = await contact.save();

    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating contact' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get overall statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalIncomes = await Income.countDocuments();
    const totalExpenses = await Expense.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });

    const allIncomes = await Income.find({});
    const allExpenses = await Expense.find({});

    const totalIncomeAmount = allIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenseAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json({
      totalUsers,
      totalIncomes,
      totalExpenses,
      pendingContacts,
      totalIncomeAmount,
      totalExpenseAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;
