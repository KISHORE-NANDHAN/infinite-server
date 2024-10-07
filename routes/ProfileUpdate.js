const express = require('express');
const User = require('../Schemas/UserSchema');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/auth');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Update user profile route
router.put('/:id', async (req, res) => { 
  const { id } = req.params;  
  const { username, bio, profilePicture } = req.body;
  try {
    // Find user by ID and update using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(id) },  // Query object, can be customized to search by other fields
      { $set: { username, bio, profilePicture } },  // Use $set to explicitly set fields
      { new: true, runValidators: true }  // Return the new document after update
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user information
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
