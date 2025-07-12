const mongoose = require('mongoose');
const adminLogSchema = new mongoose.Schema({
  type: { type: String },
  message: String,
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema);
