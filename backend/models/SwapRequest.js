const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skillRequested: String,
  skillOffered: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);