const express = require('express');
const User = require('../Schemas/UserSchema');
const authenticate = require('../middlewares/auth');
const mongoose = require('mongoose');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Update user profile route
router.put('/:id', async (req, res) => { 
  const { id } = req.params;  
  const { username, bio, profilePicture } = req.body;

  try {
    // Use ObjectId for the update
    const updatedUser = await User.findByIdAndUpdate(
      new ObjectId(id),  
      { username, bio, profilePicture },
      { new: true, runValidators: true }
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user information
    res.json(updatedUser);
    console.log(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
