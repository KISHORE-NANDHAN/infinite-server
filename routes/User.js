const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Schemas/UserSchema'); // Assuming you have a User model

// Helper function to check if the ID is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(new  mongoose.Types.ObjectId(userId));

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Follow/unfollow user
router.post('/:id/follow', async (req, res) => {
    const userId = req.params.id;

    // Validate ObjectId
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Follow/unfollow success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
