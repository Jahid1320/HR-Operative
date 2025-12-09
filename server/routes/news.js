const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');

// Middleware to check if admin
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

// @route   GET api/news
// @desc    Get all news posts
// @access  Private (User/Admin) - or Public if needed, but app is private
router.get('/', auth, newsController.getAllPosts);

// @route   POST api/news
// @desc    Create a news post
// @access  Private (Admin)
router.post('/', [auth, adminAuth], newsController.createPost);

// @route   PUT api/news/:id
// @desc    Update a news post
// @access  Private (Admin)
router.put('/:id', [auth, adminAuth], newsController.updatePost);

// @route   DELETE api/news/:id
// @desc    Delete a news post
// @access  Private (Admin)
router.delete('/:id', [auth, adminAuth], newsController.deletePost);

module.exports = router;
