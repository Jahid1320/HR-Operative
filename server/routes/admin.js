const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if admin
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

// @route   GET api/admin/scenarios
// @desc    Get all scenarios
// @access  Private (Admin)
router.get('/scenarios', [auth, adminAuth], adminController.getAllScenarios);

// @route   POST api/admin/scenario
// @desc    Create a new scenario
// @access  Private (Admin)
router.post('/scenario', [auth, adminAuth], adminController.createScenario);

// @route   PUT api/admin/scenario/:id
// @desc    Update a scenario
// @access  Private (Admin)
router.put('/scenario/:id', [auth, adminAuth], adminController.updateScenario);

// @route   DELETE api/admin/scenario/:id
// @desc    Delete a scenario
// @access  Private (Admin)
router.delete('/scenario/:id', [auth, adminAuth], adminController.deleteScenario);

// @route   GET api/admin/stats
// @desc    Get game stats
// @access  Private (Admin)
router.get('/stats', [auth, adminAuth], adminController.getStats);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', [auth, adminAuth], adminController.getAllUsers);

module.exports = router;
