const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation using regex
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({ 
        message: 'Name must be 2-50 characters and contain only letters and spaces' 
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (!subject || subject.trim().length < 3) {
      return res.status(400).json({ message: 'Subject must be at least 3 characters' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    const contact = await Contact.create({
      user: req.user._id,
      name,
      email,
      subject,
      message
    });

    res.status(201).json({ 
      message: 'Your message has been sent successfully!',
      contact 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while submitting contact form' });
  }
});

// @route   GET /api/contact
// @desc    Get user's contact messages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching contact messages' });
  }
});

module.exports = router;
