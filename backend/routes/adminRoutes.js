const express = require('express');
const { banUser, deleteSkillDescription, getPlatformStats, sendGlobalMessage } = require('../controllers/adminController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.put('/ban/:userId', protect, admin, banUser);
router.delete('/skills/:userId', protect, admin, deleteSkillDescription);
router.get('/stats', protect, admin, getPlatformStats);
router.post('/broadcast', protect, admin, sendGlobalMessage);

module.exports = router;
