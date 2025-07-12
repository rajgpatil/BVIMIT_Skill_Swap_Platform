const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const validator = require('validator');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (validator.isEmpty(name.trim()) || name.length < 2) {
            return res.json({ success: false, message: "Please enter valid name" })
    }
    if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
    }
    if(!validator.isStrongPassword(password)){
            return res.json({success:false,message:"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."})
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.json({ ...user._doc, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ ...user._doc, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
