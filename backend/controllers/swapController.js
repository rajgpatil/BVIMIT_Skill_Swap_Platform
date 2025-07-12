const SwapRequest = require('../models/SwapRequest');

exports.createSwap = async (req, res) => {
    try {
        const { receiverId, skillRequested, skillOffered } = req.body;
        const swap = await SwapRequest.create({
            requesterId: req.user._id,
            receiverId,
            skillRequested,
            skillOffered
        });
        res.status(201).json(swap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSwapStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const swap = await SwapRequest.findById(req.params.id);
        if (!swap) return res.status(404).json({ message: 'Swap not found' });
        if (![swap.requesterId.toString(), swap.receiverId.toString()].includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        swap.status = status;
        await swap.save();
        res.json(swap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserSwaps = async (req, res) => {
    try {
        const swaps = await SwapRequest.find({
            $or: [
                { requesterId: req.user._id },
                { receiverId: req.user._id }
            ]
        }).populate('requesterId receiverId', 'name email');
        res.json(swaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};