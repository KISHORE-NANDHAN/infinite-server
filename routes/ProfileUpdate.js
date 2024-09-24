const express = require('express');
const User = require('../Schemas/UserSchema');
const authenticate = require('../middlewares/auth');
const mongoose = require('mongoose');
const router = express.Router();
const { ObjectId } = mongoose.Types;

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, bio, profilePicture } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const user = await User.findById(new ObjectId(id));  // Use 'new' here
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if they exist in the request body
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
