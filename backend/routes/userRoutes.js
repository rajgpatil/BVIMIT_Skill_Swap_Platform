
const express = require('express');
const { getProfile, updateProfile, searchUsers } = require('../controllers/userController');
const protect = require('../middleware/auth');
const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/search', searchUsers);

module.exports = router;