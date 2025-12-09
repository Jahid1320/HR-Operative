const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenarioController');
const auth = require('../middleware/auth');

// @route   GET api/scenario/today
// @desc    Get current daily scenario
// @access  Private
router.get('/today', auth, scenarioController.getDailyScenario);

// @route   POST api/scenario/respond
// @desc    Submit response
// @access  Private
router.post('/respond', auth, scenarioController.submitResponse);

module.exports = router;
