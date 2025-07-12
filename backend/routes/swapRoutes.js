const express = require('express');
const { createSwap, updateSwapStatus, getUserSwaps } = require('../controllers/swapController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createSwap);
router.put('/:id/status', protect, updateSwapStatus);
router.get('/', protect, getUserSwaps);

module.exports = router;