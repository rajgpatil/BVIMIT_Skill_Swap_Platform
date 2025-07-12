const express = require('express');
const { submitFeedback, getFeedbackForUser } = require('../controllers/feedbackController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, submitFeedback);
router.get('/user/:userId', protect, getFeedbackForUser);

module.exports = router;