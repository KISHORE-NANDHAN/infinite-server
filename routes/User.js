const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Schemas/UserSchema'); // Assuming you have a User model

// Helper function to check if the ID is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const ObjectId = mongoose.Types.ObjectId; 
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

router.post('/:id/follow', async (req, res) => {
    const userId = req.params.id;
    const {currentUserId} = req.body
    // Validate ObjectId
    if (!isValidObjectId(userId) || !isValidObjectId(currentUserId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userToFollow = await User.findById(new ObjectId(userId));
        const currentUser = await User.findById(new ObjectId(currentUserId));

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userId === currentUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow logic
            await currentUser.updateOne({ $pull: { following: userId } });
            await userToFollow.updateOne({ $pull: { followers: currentUserId } });
            return res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            // Follow logic
            await currentUser.updateOne({ $push: { following: userId } });
            await userToFollow.updateOne({ $push: { followers: currentUserId } });
            return res.status(200).json({ message: 'User followed successfully' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
