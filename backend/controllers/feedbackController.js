const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { swapId, submittedFor, rating, comment } = req.body;
        const feedback = await Feedback.create({
            swapId,
            submittedBy: req.user._id,
            submittedFor,
            rating,
            comment
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFeedbackForUser = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ submittedFor: req.params.userId });
        res.json(feedbacks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};