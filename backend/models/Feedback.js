const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  swapId: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);