const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Schemas/UserSchema'); // Assuming you have a User model
const Post = require('../Schemas/PostSchema');
const Notifications = require('../Schemas/NotificationSchema');
const Freeze = require('../Schemas/FreezeSchema')

// Route to get all users
router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error, try again later.' });
    }
});

// Route to delete a user by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id); // Delete user
        await Post.findOneAndDelete({ user: id }); // Delete posts by user
        await Notifications.findOneAndDelete({ user: id }); // Delete notifications by user
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error, try again later.' });
    }
});

router.post('/freezeUser', async (req, res) => {
    const { userId, freezeReason, duration } = req.body;
  
    try {
      const freezeStart = new Date();
  
      // Set default duration to 1 hour if not provided
      const freezeDuration = duration || 1; // default is 1 hour
      const freezeEnd = new Date(freezeStart.getTime() + freezeDuration * 60 * 60 * 1000); // calculate freezeEnd
  
      const freezeData = new Freeze({
        userId,
        freezeReason,
        freezeStart,
        freezeEnd,  // ensure freezeEnd is always set
        status: 'active'
      });
    
      await freezeData.save();
      res.status(201).json({ message: 'User account frozen successfully', freezeData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to freeze user account' });
    }
  });
  
module.exports = router;
