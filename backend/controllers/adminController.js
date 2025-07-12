const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const Feedback = require('../models/Feedback');
const AdminLog = require('../models/AdminLog');

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.banned = true;
    await user.save();
    await AdminLog.create({ type: 'ban', message: 'User banned', targetUserId: user._id });
    res.json({ message: 'User banned' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkillDescription = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.skillsOffered = [];
    await user.save();
    res.json({ message: 'Skills cleared' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlatformStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const swaps = await SwapRequest.countDocuments();
    const feedbacks = await Feedback.countDocuments();
    res.json({ users, swaps, feedbacks });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendGlobalMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const log = await AdminLog.create({ type: 'broadcast', message });
    res.status(201).json(log);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};