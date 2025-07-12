const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  Object.assign(user, req.body);
  await user.save();
  res.json(user);
};

exports.searchUsers = async (req, res) => {
  const skill = req.query.skill;
  const users = await User.find({ skillsOffered: { $regex: skill, $options: 'i' }, isPublic: true });
  res.json(users);
};