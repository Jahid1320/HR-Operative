const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   PUT api/auth/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, authController.updateProfile);

// @route   PUT api/auth/me/password
// @desc    Update password
// @access  Private
router.put('/me/password', auth, authController.updatePassword);

// @route   GET api/auth/history
// @desc    Get user history
// @access  Private
router.get('/history', auth, authController.getHistory);

// @route   GET api/auth/leaderboard
// @desc    Get leaderboard
// @access  Public/Private
router.get('/leaderboard', authController.getLeaderboard);

module.exports = router;
