const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        Object.assign(user, req.body);
        await user.save();
        res.json(user);
    }
    catch (error) {
    res.status(500).json({ message: error.message });
    }
};

exports.searchUsers = async (req, res) => {
  try{
    const skill = req.query.skill;
    const users = await User.find({ skillsOffered: { $regex: skill, $options: 'i' }, isPublic: true });
    res.json(users);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};